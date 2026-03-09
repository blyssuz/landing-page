'use client';

import { ExternalLink } from 'lucide-react';

const MAPS_API_KEY = 'AIzaSyAJGY6AKA5S0eJQsPJCU0BqAanlhgpvJU0';

interface LocationMapProps {
  lat: number;
  lng: number;
  businessName: string;
  address?: string | null;
  directionsLabel: string;
}

export function LocationMap({ lat, lng, businessName, address, directionsLabel }: LocationMapProps) {
  const mapsLink = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;

  return (
    <div>
      <div className="w-full aspect-[16/9] rounded-2xl overflow-hidden bg-stone-100">
        <iframe
          src={`https://www.google.com/maps/embed/v1/place?key=${MAPS_API_KEY}&q=${lat},${lng}&zoom=15`}
          className="w-full h-full border-0"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
      <div className="mt-3 px-1">
        {address && (
          <p className="text-lg text-stone-600">{address}</p>
        )}
        <a
          href={mapsLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-lg font-medium mt-1.5 text-[var(--primary)] hover:underline"
        >
          {directionsLabel}
          <ExternalLink size={14} />
        </a>
      </div>
    </div>
  );
}
