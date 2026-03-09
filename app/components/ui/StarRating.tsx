'use client';

import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from './_lib/cn';

export interface StarRatingProps {
  rating: number;
  reviewCount?: number;
  className?: string;
  /** When true, stars are clickable for user input */
  interactive?: boolean;
  /** Callback when user selects a rating (interactive mode) */
  onChange?: (rating: number) => void;
  /** Star icon size */
  size?: 'sm' | 'md' | 'lg';
}

const sizeMap = {
  sm: 14,
  md: 16,
  lg: 24,
} as const;

const StarRating = React.forwardRef<HTMLDivElement, StarRatingProps>(
  (
    {
      rating,
      reviewCount,
      className,
      interactive = false,
      onChange,
      size = 'md',
    },
    ref,
  ) => {
    const [hoverRating, setHoverRating] = useState<number | null>(null);

    const normalizedRating = Math.min(Math.max(rating, 0), 5);
    const displayRating = interactive && hoverRating !== null ? hoverRating : normalizedRating;
    const fullStars = Math.floor(displayRating);
    const hasHalfStar = !interactive && displayRating % 1 >= 0.5;
    const iconSize = sizeMap[size];

    const handleStarClick = (starIndex: number) => {
      if (interactive && onChange) {
        onChange(starIndex + 1);
      }
    };

    const handleMouseEnter = (starIndex: number) => {
      if (interactive) {
        setHoverRating(starIndex + 1);
      }
    };

    const handleMouseLeave = () => {
      if (interactive) {
        setHoverRating(null);
      }
    };

    return (
      <div
        ref={ref}
        className={cn('inline-flex items-center gap-2', className)}
      >
        <div
          className="inline-flex gap-0.5"
          onMouseLeave={handleMouseLeave}
        >
          {Array.from({ length: 5 }).map((_, index) => {
            const isFilled = index < fullStars;
            const isHalf = index === fullStars && hasHalfStar;

            if (interactive) {
              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleStarClick(index)}
                  onMouseEnter={() => handleMouseEnter(index)}
                  className="cursor-pointer transition-transform hover:scale-110 bg-transparent border-none p-0"
                  aria-label={`Rate ${index + 1} star${index + 1 > 1 ? 's' : ''}`}
                >
                  <Star
                    size={iconSize}
                    className={isFilled ? 'text-amber-400' : 'text-stone-300'}
                    fill="currentColor"
                  />
                </button>
              );
            }

            return (
              <div key={index} className="relative">
                <Star
                  size={iconSize}
                  className="text-stone-300"
                  fill="currentColor"
                />
                {(isFilled || isHalf) && (
                  <div
                    className={cn(
                      'absolute top-0 left-0 text-amber-400 overflow-hidden',
                      isHalf ? 'w-1/2' : 'w-full',
                    )}
                  >
                    <Star
                      size={iconSize}
                      fill="currentColor"
                      className="text-amber-400"
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
        {reviewCount !== undefined && (
          <span className="text-sm text-stone-500">({reviewCount})</span>
        )}
      </div>
    );
  },
);

StarRating.displayName = 'StarRating';

export { StarRating };
