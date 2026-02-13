'use client';

import React from 'react';
import { Star } from 'lucide-react';

export interface StarRatingProps {
  rating: number;
  reviewCount?: number;
  className?: string;
}

const StarRating = React.forwardRef<HTMLDivElement, StarRatingProps>(
  ({ rating, reviewCount, className = '' }, ref) => {
    // Ensure rating is between 0 and 5
    const normalizedRating = Math.min(Math.max(rating, 0), 5);
    const fullStars = Math.floor(normalizedRating);
    const hasHalfStar = normalizedRating % 1 >= 0.5;

    return (
      <div
        ref={ref}
        className={`inline-flex items-center gap-2 ${className}`.trim()}
      >
        <div className="inline-flex gap-0.5">
          {Array.from({ length: 5 }).map((_, index) => {
            const isFilled = index < fullStars;
            const isHalf = index === fullStars && hasHalfStar;

            return (
              <div key={index} className="relative">
                <Star
                  size={16}
                  className="text-gray-300"
                  fill="currentColor"
                />
                {(isFilled || isHalf) && (
                  <div
                    className={`absolute top-0 left-0 text-amber-400 overflow-hidden ${
                      isHalf ? 'w-1/2' : 'w-full'
                    }`.trim()}
                  >
                    <Star
                      size={16}
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
          <span className="text-sm text-gray-600">({reviewCount})</span>
        )}
      </div>
    );
  }
);

StarRating.displayName = 'StarRating';

export { StarRating };
