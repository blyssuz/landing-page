'use client';

import React, { useState } from 'react';
import { Star } from 'lucide-react';
import type { Review, ReviewStats, MultilingualText } from '../_lib/types';
import type { Locale } from '@/lib/i18n';
import { getText, getRelativeDate } from '../_lib/utils';
import { RatingDistribution } from './RatingDistribution';
import { ReviewCard } from './ReviewCard';

export interface ReviewsSectionProps {
  reviews: Review[];
  reviewStats: ReviewStats | null;
  locale: Locale;
  translations: {
    reviewsTitle: string;
    reviewCount: string;
    showAllReviews: string;
    showFewerReviews: string;
    noReviews: string;
    beTheFirst: string;
  };
}

const ReviewsSection = React.forwardRef<HTMLDivElement, ReviewsSectionProps>(
  ({ reviews, reviewStats, locale, translations: t }, ref) => {
    const [showAll, setShowAll] = useState(false);

    const displayedReviews = showAll ? reviews : reviews.slice(0, 3);

    const localGetText = (
      text: MultilingualText | string | null | undefined
    ) => getText(text, locale);

    const localGetRelativeDate = (dateStr: string) =>
      getRelativeDate(dateStr, locale);

    return (
      <div ref={ref} className="scroll-mt-16">
        <h2 className="text-[24px] lg:text-[28px] font-semibold text-stone-900 leading-[32px] lg:leading-[36px] pb-4 lg:pb-5">
          {t.reviewsTitle}
        </h2>

        {reviews.length === 0 ? (
          <div className="py-12 text-center">
            <Star size={32} className="mx-auto text-stone-300 mb-3" />
            <p className="text-stone-400 text-[15px]">{t.noReviews}</p>
            <p className="text-stone-400 text-[13px] mt-1">{t.beTheFirst}</p>
          </div>
        ) : (
          <>
            {/* Aggregate rating — large gold stars */}
            {reviewStats && reviewStats.total_reviews > 0 && (
              <RatingDistribution
                stats={reviewStats}
                reviewCountLabel={t.reviewCount}
              />
            )}

            {/* Review cards — borderless, divided by thin lines */}
            <div className="divide-y divide-stone-100">
              {displayedReviews.map((review) => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  locale={locale}
                  getText={localGetText}
                  getRelativeDate={localGetRelativeDate}
                />
              ))}
            </div>

            {/* Show all / show fewer */}
            {reviews.length > 3 && (
              <button
                onClick={() => setShowAll(!showAll)}
                className="w-full mt-3 py-3 text-[16px] font-medium text-stone-900 border border-stone-200 rounded-full hover:bg-stone-50 transition-colors"
              >
                {showAll
                  ? t.showFewerReviews
                  : `${t.showAllReviews} (${reviews.length})`}
              </button>
            )}
          </>
        )}
      </div>
    );
  }
);

ReviewsSection.displayName = 'ReviewsSection';

export { ReviewsSection };
