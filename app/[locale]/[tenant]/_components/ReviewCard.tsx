'use client';

import React from 'react';
import { Avatar } from '@/app/components/ui/Avatar';
import { Badge } from '@/app/components/ui/Badge';
import { StarRating } from '@/app/components/ui/StarRating';
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
      <div
        ref={ref}
        className="bg-white rounded-xl lg:rounded-2xl p-3.5 lg:p-5 border border-stone-100"
      >
        {/* Header: avatar + service info + star rating */}
        <div className="flex items-center justify-between mb-2.5 lg:mb-3">
          <div className="flex items-center gap-2.5 lg:gap-3 min-w-0">
            <Avatar
              name={review.customer_name}
              size="sm"
              className="w-8 h-8 lg:w-10 lg:h-10"
            />
            <div className="min-w-0">
              <p className="text-sm font-medium text-stone-900 line-clamp-1">
                {review.customer_name}
              </p>
              <p className="text-xs text-stone-400">
                {review.submitted_at
                  ? getRelativeDate(review.submitted_at)
                  : ''}
              </p>
            </div>
          </div>
          {review.rating !== null && review.rating > 0 && (
            <StarRating rating={review.rating} size="sm" className="flex-shrink-0" />
          )}
        </div>

        {/* Comment text */}
        {review.comment && (
          <p className="text-sm text-stone-600 leading-relaxed mb-2">
            {review.comment}
          </p>
        )}

        {/* Service badges */}
        {review.services.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {review.services.map((svc, idx) => (
              <Badge key={idx} variant="default" size="sm">
                {getText(svc.service_name)}
                {svc.employee_name && (
                  <span className="text-stone-400">
                    {' '}
                    &middot; {svc.employee_name}
                  </span>
                )}
              </Badge>
            ))}
          </div>
        )}
      </div>
    );
  }
);

ReviewCard.displayName = 'ReviewCard';

export { ReviewCard };
