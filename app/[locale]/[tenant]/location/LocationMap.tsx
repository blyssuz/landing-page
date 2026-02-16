'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, Navigation } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Locale } from '@/lib/i18n';
import { BottomNav } from '@/app/components/layout/BottomNav';

interface LocationMapProps {
  locale: Locale;
  businessName: string;
  address?: string | null;
  lat: number;
  lng: number;
  primaryColor?: string | null;
}

const T = {
  uz: { location: 'Joylashuv', directions: 'Yo\'nalish' },
  ru: { location: 'Местоположение', directions: 'Маршрут' },
} as const;

export function LocationMap({ locale, businessName, address, lat, lng, primaryColor }: LocationMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const t = T[locale];

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current, {
      zoomControl: false,
      attributionControl: false,
    }).setView([lat, lng], 16);

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    const color = primaryColor || '#088395';

    const markerIcon = L.divIcon({
      className: '',
      html: `<div style="display:flex;align-items:center;justify-content:center;width:40px;height:40px;border-radius:50%;background:${color};box-shadow:0 2px 8px rgba(0,0,0,0.3);">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
      </div>`,
      iconSize: [40, 40],
      iconAnchor: [20, 40],
    });

    L.marker([lat, lng], { icon: markerIcon }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [lat, lng, primaryColor]);

  return (
    <div className="fixed inset-0 z-0 flex flex-col bg-white dark:bg-zinc-900" style={primaryColor ? { '--primary': primaryColor } as React.CSSProperties : undefined}>
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-[1000] bg-white/80 dark:bg-zinc-900/80 backdrop-blur-lg border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link
            href={`/${locale}`}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <ChevronLeft size={20} className="text-zinc-900 dark:text-zinc-100" />
          </Link>
          <div className="min-w-0">
            <h1 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 truncate">{businessName}</h1>
            {address && (
              <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">{address}</p>
            )}
          </div>
        </div>
      </div>

      {/* Map */}
      <div ref={mapRef} className="flex-1 w-full" style={{ marginTop: '60px', marginBottom: '72px' }} />

      {/* Directions FAB */}
      <a
        href={`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute z-[1000] left-4 flex items-center gap-2 px-4 py-2.5 rounded-full text-white text-sm font-semibold shadow-lg"
        style={{ bottom: '88px', backgroundColor: primaryColor || '#088395' }}
      >
        <Navigation size={16} />
        {t.directions}
      </a>

      <BottomNav locale={locale} />
    </div>
  );
}
