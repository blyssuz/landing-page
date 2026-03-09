'use client';

import React from 'react';
import { StarRating } from '@/app/components/ui/StarRating';
import type { ReviewStats } from '../_lib/types';

export interface RatingDistributionProps {
  stats: ReviewStats;
  reviewCountLabel: string;
}

const RatingDistribution = React.forwardRef<
  HTMLDivElement,
  RatingDistributionProps
>(({ stats, reviewCountLabel }, ref) => {
  const { average_rating, total_reviews, rating_distribution } = stats;

  return (
    <div
      ref={ref}
      className="flex items-center gap-4 lg:gap-6 bg-stone-50 rounded-2xl p-4 lg:p-5 mb-4 lg:mb-5"
    >
      <div className="flex flex-col items-center gap-1">
        <span className="text-4xl lg:text-5xl font-bold text-stone-900">
          {average_rating}
        </span>
        <StarRating rating={average_rating} size="sm" />
        <span className="text-xs text-stone-400 mt-0.5">
          {total_reviews} {reviewCountLabel}
        </span>
      </div>
      <div className="flex-1 space-y-1.5">
        {[5, 4, 3, 2, 1].map((star) => {
          const count = rating_distribution[star] || 0;
          const pct =
            total_reviews > 0 ? (count / total_reviews) * 100 : 0;
          return (
            <div key={star} className="flex items-center gap-2">
              <span className="text-xs text-stone-400 w-3 text-right">
                {star}
              </span>
              <div className="flex-1 h-2 bg-stone-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="text-xs text-stone-400 w-5 text-right">
                {count}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
});

RatingDistribution.displayName = 'RatingDistribution';

export { RatingDistribution };
