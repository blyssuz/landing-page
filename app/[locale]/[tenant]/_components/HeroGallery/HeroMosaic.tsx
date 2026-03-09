'use client';

import type { Photo } from '../../_lib/types';

export interface HeroMosaicProps {
  photos: Photo[];
  businessName: string;
  onPhotoClick: (index: number) => void;
  onSeeAll: () => void;
  totalPhotoCount: number;
}

/**
 * Build mosaic images array from photos (cover + interior + exterior, fill to 5).
 */
function buildMosaicImages(photos: Photo[], coverUrl: string | null): string[] {
  const allPhotos = photos.map((p) => ({ url: p.url, category: p.category }));
  const interiorPhotos = allPhotos.filter((p) => p.category === 'interior');
  const exteriorPhotos = allPhotos.filter((p) => p.category === 'exterior');

  const mosaic: string[] = [];
  if (coverUrl) mosaic.push(coverUrl);
  if (interiorPhotos.length > 0 && interiorPhotos[0].url !== coverUrl) {
    mosaic.push(interiorPhotos[0].url);
  }
  if (exteriorPhotos.length > 0) mosaic.push(exteriorPhotos[0].url);
  for (const p of allPhotos) {
    if (mosaic.length >= 5) break;
    if (!mosaic.includes(p.url)) mosaic.push(p.url);
  }
  return mosaic;
}

export function HeroMosaic({
  photos,
  businessName,
  onPhotoClick,
  onSeeAll,
  totalPhotoCount,
}: HeroMosaicProps) {
  const coverUrl = photos.length > 0 ? photos[0].url : null;
  const mosaicImages = buildMosaicImages(photos, coverUrl);

  if (mosaicImages.length === 0) return null;

  return (
    <div className="hidden lg:block max-w-[1350px] mx-auto px-6 pt-4">
      <div className="relative h-[460px] cursor-pointer overflow-hidden rounded-2xl">
        {mosaicImages.length >= 3 ? (
          <div className="grid grid-cols-4 grid-rows-2 gap-1.5 h-full">
            {/* Large left image */}
            <div
              className="col-span-2 row-span-2 overflow-hidden rounded-l-2xl"
              onClick={() => onPhotoClick(0)}
            >
              <img
                src={mosaicImages[0]}
                alt={businessName}
                className="w-full h-full object-cover hover:brightness-95 transition-all duration-300"
              />
            </div>
            {/* Top-middle */}
            <div
              className="overflow-hidden"
              onClick={() => onPhotoClick(1)}
            >
              <img
                src={mosaicImages[1]}
                alt=""
                className="w-full h-full object-cover hover:brightness-95 transition-all duration-300"
              />
            </div>
            {/* Top-right */}
            <div
              className="rounded-tr-2xl overflow-hidden"
              onClick={() => onPhotoClick(2)}
            >
              <img
                src={mosaicImages[2]}
                alt=""
                className="w-full h-full object-cover hover:brightness-95 transition-all duration-300"
              />
            </div>
            {/* Bottom-middle */}
            {mosaicImages[3] ? (
              <div
                className="overflow-hidden"
                onClick={() => onPhotoClick(3)}
              >
                <img
                  src={mosaicImages[3]}
                  alt=""
                  className="w-full h-full object-cover hover:brightness-95 transition-all duration-300"
                />
              </div>
            ) : (
              <div className="bg-stone-200" />
            )}
            {/* Bottom-right */}
            {mosaicImages[4] ? (
              <div
                className="rounded-br-2xl overflow-hidden"
                onClick={() => onPhotoClick(4)}
              >
                <img
                  src={mosaicImages[4]}
                  alt=""
                  className="w-full h-full object-cover hover:brightness-95 transition-all duration-300"
                />
              </div>
            ) : (
              <div className="bg-stone-200 rounded-br-2xl" />
            )}
          </div>
        ) : mosaicImages.length === 2 ? (
          <div className="grid grid-cols-2 gap-1.5 h-full">
            <div
              className="rounded-l-2xl overflow-hidden"
              onClick={() => onPhotoClick(0)}
            >
              <img
                src={mosaicImages[0]}
                alt={businessName}
                className="w-full h-full object-cover hover:brightness-95 transition-all duration-300"
              />
            </div>
            <div
              className="rounded-r-2xl overflow-hidden"
              onClick={() => onPhotoClick(1)}
            >
              <img
                src={mosaicImages[1]}
                alt=""
                className="w-full h-full object-cover hover:brightness-95 transition-all duration-300"
              />
            </div>
          </div>
        ) : (
          <div
            className="h-full rounded-2xl overflow-hidden"
            onClick={() => onPhotoClick(0)}
          >
            <img
              src={mosaicImages[0]}
              alt={businessName}
              className="w-full h-full object-cover hover:brightness-95 transition-all duration-300"
            />
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/20 to-transparent pointer-events-none rounded-b-2xl" />

        {/* Photo counter */}
        <div className="absolute top-4 right-4 px-2.5 py-1 bg-black/50 backdrop-blur-sm rounded-full text-white text-xs font-medium">
          1/{totalPhotoCount}
        </div>

        {/* See all photos button */}
        {totalPhotoCount > 5 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSeeAll();
            }}
            className="absolute bottom-4 right-4 px-5 py-2.5 bg-white text-stone-900 rounded-lg shadow-lg text-sm font-semibold border border-stone-200 hover:bg-stone-50 transition-colors"
          >
            {totalPhotoCount} photos
          </button>
        )}
      </div>
    </div>
  );
}
