'use client';

import React from 'react';
import { Star } from 'lucide-react';
import type { ReviewStats } from '../_lib/types';

export interface RatingDistributionProps {
  stats: ReviewStats;
  reviewCountLabel: string;
}

const RatingDistribution = React.forwardRef<
  HTMLDivElement,
  RatingDistributionProps
>(({ stats, reviewCountLabel }, ref) => {
  const { average_rating, total_reviews } = stats;

  return (
    <div ref={ref} className="mb-5 lg:mb-6">
      {/* Large gold stars — Fresha style */}
      <div className="flex items-center gap-1 mb-1.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={28}
            className={
              star <= Math.round(average_rating)
                ? 'fill-amber-400 text-amber-400'
                : 'fill-stone-200 text-stone-200'
            }
          />
        ))}
      </div>
      <div className="flex items-center gap-1.5">
        <span className="text-[17px] font-semibold text-stone-900">
          {average_rating}
        </span>
        <span className="text-[17px] text-stone-500">
          ({total_reviews})
        </span>
      </div>
    </div>
  );
});

RatingDistribution.displayName = 'RatingDistribution';

export { RatingDistribution };
