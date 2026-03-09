'use client';

import React from 'react';
import { Star } from 'lucide-react';
import { Avatar } from '@/app/components/ui/Avatar';
import type { Review, MultilingualText } from '../_lib/types';
import type { Locale } from '@/lib/i18n';

export interface ReviewCardProps {
  review: Review;
  locale: Locale;
  getText: (text: MultilingualText | string | null | undefined) => string;
  getRelativeDate: (dateStr: string) => string;
}

const ReviewCard = React.forwardRef<HTMLDivElement, ReviewCardProps>(
  ({ review, getText, getRelativeDate }, ref) => {
    return (
      <div ref={ref} className="py-4 first:pt-0">
        {/* Header: avatar + name + date */}
        <div className="flex items-center gap-2.5 lg:gap-3 mb-2">
          <Avatar
            name={review.customer_name}
            size="sm"
            className="w-10 h-10 lg:w-11 lg:h-11"
          />
          <div className="min-w-0">
            <p className="text-[17px] font-medium text-stone-900 line-clamp-1">
              {review.customer_name}
            </p>
            <p className="text-[15px] text-stone-500">
              {review.submitted_at
                ? getRelativeDate(review.submitted_at)
                : ''}
            </p>
          </div>
        </div>

        {/* Star rating — prominent gold stars like Fresha */}
        {review.rating !== null && review.rating > 0 && (
          <div className="flex items-center gap-0.5 mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={18}
                className={
                  star <= review.rating!
                    ? 'fill-amber-400 text-amber-400'
                    : 'fill-stone-200 text-stone-200'
                }
              />
            ))}
          </div>
        )}

        {/* Comment text */}
        {review.comment && (
          <p className="text-[17px] text-stone-900 leading-relaxed">
            {review.comment}
          </p>
        )}
      </div>
    );
  }
);

ReviewCard.displayName = 'ReviewCard';

export { ReviewCard };
