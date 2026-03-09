'use client';

import { useRef, useState } from 'react';
import type { Photo } from '../../_lib/types';

export interface HeroCarouselProps {
  photos: Photo[];
  businessName: string;
  tagline?: string;
  onPhotoClick: (index: number) => void;
  totalPhotoCount: number;
  onSeeAll: () => void;
}

export function HeroCarousel({
  photos,
  businessName,
  tagline,
  onPhotoClick,
  totalPhotoCount,
  onSeeAll,
}: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  const displayPhotos = photos.map((p) => p.url);

  if (displayPhotos.length === 0) return null;

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const idx = Math.round(el.scrollLeft / el.clientWidth);
    setCurrentIndex(idx);
  };

  return (
    <div className="lg:hidden relative">
      {/* Scrollable carousel */}
      <div
        ref={carouselRef}
        className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide h-[300px]"
        onScroll={handleScroll}
      >
        {displayPhotos.map((url, i) => (
          <div
            key={i}
            className="flex-shrink-0 w-full h-full snap-center cursor-pointer"
            onClick={() => onPhotoClick(i)}
          >
            <img
              src={url}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/50 via-black/20 to-transparent pointer-events-none" />

      {/* Business name + tagline overlay */}
      <div className="absolute bottom-0 inset-x-0 p-4 pointer-events-none">
        <h1 className="text-xl font-bold text-white leading-tight drop-shadow-lg">
          {businessName}
        </h1>
        {tagline && (
          <p className="text-xs text-white/80 mt-0.5 drop-shadow">
            {tagline}
          </p>
        )}
      </div>

      {/* Photo counter top-right */}
      <div className="absolute top-3 right-3 px-2.5 py-1 bg-black/50 backdrop-blur-sm rounded-full text-white text-xs font-medium">
        {currentIndex + 1}/{totalPhotoCount}
      </div>

      {/* See all button bottom-right */}
      {totalPhotoCount > 5 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSeeAll();
          }}
          className="absolute bottom-12 right-4 px-3 py-1.5 bg-white/90 backdrop-blur-sm text-stone-900 rounded-full text-xs font-semibold shadow-sm"
        >
          {totalPhotoCount} photos
        </button>
      )}

      {/* Dot indicators bottom-right */}
      {displayPhotos.length > 1 && (
        <div className="absolute bottom-4 right-4 flex gap-1.5 items-center">
          {displayPhotos.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === currentIndex
                  ? 'w-5 bg-white'
                  : 'w-1.5 bg-white/50'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
