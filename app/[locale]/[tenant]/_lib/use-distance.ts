'use client';

import { useState, useEffect } from 'react';
import { getDistance, reverseGeocode } from '../actions';
import type { Business, Locale } from './types';

interface DistanceResult {
  distance: number;
  metric: string;
}

interface UseDistanceReturn {
  distance: DistanceResult | null;
  distanceLoading: boolean;
  distanceDenied: boolean;
  geoAddress: string | null;
  fetchDistance: (isManual?: boolean) => void;
  showLocationModal: boolean;
  setShowLocationModal: (show: boolean) => void;
}

const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

function getCachedDistance(cacheKey: string): DistanceResult | null {
  try {
    const raw = localStorage.getItem(cacheKey);
    if (!raw) return null;
    const cached = JSON.parse(raw);
    if (Date.now() - cached.timestamp < CACHE_TTL) {
      return { distance: cached.distance, metric: cached.metric };
    }
    localStorage.removeItem(cacheKey);
  } catch {
    /* ignore */
  }
  return null;
}

function cacheDistance(cacheKey: string, data: DistanceResult): void {
  try {
    localStorage.setItem(
      cacheKey,
      JSON.stringify({ ...data, timestamp: Date.now() })
    );
  } catch {
    /* ignore */
  }
}

export function useDistance(business: Business, locale: Locale): UseDistanceReturn {
  const [distance, setDistance] = useState<DistanceResult | null>(null);
  const [distanceLoading, setDistanceLoading] = useState(false);
  const [distanceDenied, setDistanceDenied] = useState(false);
  const [geoAddress, setGeoAddress] = useState<string | null>(null);
  const [showLocationModal, setShowLocationModal] = useState(false);

  const DISTANCE_CACHE_KEY = `distance_${business.tenant_url}`;
  const ADDRESS_CACHE_KEY = `address_v2_${business.tenant_url}_${locale}`;
  const LOCATION_DENIED_KEY = 'blyss_location_denied';

  const fetchDistance = (isManual = false) => {
    if (!business.location?.lat || !business.location?.lng) return;
    if (typeof navigator === 'undefined' || !navigator.geolocation) return;

    setDistanceLoading(true);
    setDistanceDenied(false);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const slug = business.tenant_url.replace(/\.blyss\.uz$/, '');
          const data = await getDistance(
            slug,
            position.coords.latitude,
            position.coords.longitude
          );
          if (data?.distance !== undefined && data?.metric) {
            const result = { distance: data.distance, metric: data.metric };
            setDistance(result);
            cacheDistance(DISTANCE_CACHE_KEY, result);
          }
        } catch {
          // silently fail
        } finally {
          setDistanceLoading(false);
        }
      },
      () => {
        setDistanceLoading(false);
        setDistanceDenied(true);
        try {
          sessionStorage.setItem(LOCATION_DENIED_KEY, '1');
        } catch {
          /* ignore */
        }
        if (isManual) {
          setShowLocationModal(true);
        }
      }
    );
  };

  // Fetch distance on mount (from cache or geolocation)
  useEffect(() => {
    const cached = getCachedDistance(DISTANCE_CACHE_KEY);
    if (cached) {
      setDistance(cached);
      return;
    }
    // Skip geolocation request when opened from Instagram (in-app browser)
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get('utm_source') === 'ig' || params.has('fbclid')) {
        return;
      }
    } catch {
      /* ignore */
    }
    try {
      if (sessionStorage.getItem(LOCATION_DENIED_KEY)) {
        setDistanceDenied(true);
        return;
      }
    } catch {
      /* ignore */
    }
    fetchDistance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [business.location, business.tenant_url]);

  // Reverse geocode for address
  useEffect(() => {
    if (!business.location?.lat || !business.location?.lng) return;
    try {
      const raw = localStorage.getItem(ADDRESS_CACHE_KEY);
      if (raw) {
        const cached = JSON.parse(raw);
        if (Date.now() - cached.timestamp < CACHE_TTL) {
          setGeoAddress(cached.address);
          return;
        }
        localStorage.removeItem(ADDRESS_CACHE_KEY);
      }
    } catch {
      /* ignore */
    }
    reverseGeocode(business.location.lat, business.location.lng, locale).then(
      (address) => {
        if (address) {
          setGeoAddress(address);
          try {
            localStorage.setItem(
              ADDRESS_CACHE_KEY,
              JSON.stringify({ address, timestamp: Date.now() })
            );
          } catch {
            /* ignore */
          }
        }
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [business.location, locale]);

  return {
    distance,
    distanceLoading,
    distanceDenied,
    geoAddress,
    fetchDistance,
    showLocationModal,
    setShowLocationModal,
  };
}
