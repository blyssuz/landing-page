'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { springs } from '@/lib/animations';

export interface GalleryLightboxProps {
  photos: { url: string; category: string }[];
  initialIndex: number;
  open: boolean;
  onClose: () => void;
  translations: {
    allPhotos: string;
    interior: string;
    exterior: string;
  };
}

export function GalleryLightbox({
  photos,
  initialIndex,
  open,
  onClose,
  translations,
}: GalleryLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [filter, setFilter] = useState<'all' | 'interior' | 'exterior'>('all');
  const [showOverlay, setShowOverlay] = useState(true);

  // Sync initialIndex when opening
  useEffect(() => {
    if (open) {
      setCurrentIndex(initialIndex);
      setFilter('all');
      setShowOverlay(true);
    }
  }, [open, initialIndex]);

  // Body scroll lock
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [open]);

  const filteredPhotos =
    filter === 'all'
      ? photos
      : photos.filter((p) => p.category === filter);

  const safeIndex = Math.min(currentIndex, Math.max(0, filteredPhotos.length - 1));

  const goNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % filteredPhotos.length);
  }, [filteredPhotos.length]);

  const goPrev = useCallback(() => {
    setCurrentIndex(
      (prev) => (prev - 1 + filteredPhotos.length) % filteredPhotos.length
    );
  }, [filteredPhotos.length]);

  // Keyboard navigation
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose, goNext, goPrev]);

  const handleChangeFilter = (cat: 'all' | 'interior' | 'exterior') => {
    setFilter(cat);
    setCurrentIndex(0);
  };

  return (
    <AnimatePresence>
      {open && filteredPhotos.length > 0 && (
        <motion.div
          className="fixed inset-0 bg-black/90 z-50 flex flex-col"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Header */}
          <motion.div
            className="flex items-center justify-between p-3 lg:p-4 text-white"
            animate={{ opacity: showOverlay ? 1 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center gap-2 lg:gap-3 overflow-x-auto scrollbar-hide">
              <span className="text-xs lg:text-sm font-medium flex-shrink-0">
                {safeIndex + 1} / {filteredPhotos.length}
              </span>
              <div className="flex gap-1 lg:gap-1.5 ml-2 lg:ml-4">
                {(
                  [
                    { key: 'all' as const, label: translations.allPhotos },
                    { key: 'interior' as const, label: translations.interior },
                    { key: 'exterior' as const, label: translations.exterior },
                  ] as const
                ).map(({ key, label }) => {
                  const count =
                    key === 'all'
                      ? photos.length
                      : photos.filter((p) => p.category === key).length;
                  if (count === 0 && key !== 'all') return null;
                  return (
                    <button
                      key={key}
                      onClick={() => handleChangeFilter(key)}
                      className={`px-2.5 lg:px-4 py-1 lg:py-1.5 rounded-full text-[10px] lg:text-xs font-medium transition-colors flex-shrink-0 ${
                        filter === key
                          ? 'bg-white text-black'
                          : 'bg-white/15 text-white hover:bg-white/25'
                      }`}
                    >
                      {label} ({count})
                    </button>
                  );
                })}
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors flex-shrink-0"
            >
              <X size={22} />
            </button>
          </motion.div>

          {/* Image area with drag gestures */}
          <div
            className="flex-1 flex items-center justify-center relative px-4"
            onClick={() => setShowOverlay((prev) => !prev)}
          >
            <AnimatePresence mode="wait">
              <motion.img
                key={`${filter}-${safeIndex}`}
                src={filteredPhotos[safeIndex]?.url || ''}
                alt=""
                className="max-w-full max-h-full object-contain select-none"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={springs.snappy}
                drag
                dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                dragElastic={0.5}
                onDragEnd={(_e, info) => {
                  // Swipe left/right for next/prev
                  if (
                    Math.abs(info.offset.x) > 50 &&
                    Math.abs(info.velocity.x) > 500
                  ) {
                    if (info.offset.x < 0) {
                      goNext();
                    } else {
                      goPrev();
                    }
                  }
                  // Swipe down to dismiss
                  if (info.offset.y > 100 && info.velocity.y > 300) {
                    onClose();
                  }
                }}
              />
            </AnimatePresence>

            {/* Desktop nav arrows */}
            {filteredPhotos.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    goPrev();
                  }}
                  className="absolute left-4 hidden lg:flex w-12 h-12 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-full items-center justify-center text-white transition-colors"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    goNext();
                  }}
                  className="absolute right-4 hidden lg:flex w-12 h-12 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-full items-center justify-center text-white transition-colors"
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}
          </div>

          {/* Thumbnail strip */}
          <motion.div
            className="p-4 flex gap-2 overflow-x-auto justify-center scrollbar-hide"
            animate={{ opacity: showOverlay ? 1 : 0 }}
            transition={{ duration: 0.2 }}
          >
            {filteredPhotos.map((photo, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden transition-all ${
                  idx === safeIndex
                    ? 'ring-2 ring-primary ring-offset-2 ring-offset-black'
                    : 'opacity-40 hover:opacity-70'
                }`}
              >
                <img
                  src={photo.url}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
