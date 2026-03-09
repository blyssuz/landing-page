'use client';

import type { Photo } from '../_lib/types';

interface PhotoStripProps {
  photos: Photo[];
  onPhotoClick: (index: number) => void;
}

export function PhotoStrip({ photos, onPhotoClick }: PhotoStripProps) {
  if (photos.length === 0) return null;

  return (
    <div className="px-4 py-3">
      <div className="flex gap-2 overflow-x-auto scrollbar-hide">
        {photos.map((photo, i) => (
          <button
            key={photo.id}
            onClick={() => onPhotoClick(i)}
            className="flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden active:scale-95 transition-transform"
          >
            <img
              src={photo.url}
              alt=""
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
