'use client';

import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { SectionHeading } from '@/app/components/ui/SectionHeading';
import { Button } from '@/app/components/ui/Button';
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
        <div className="pb-3 lg:pb-4">
          <SectionHeading as="h2" size="md">
            {t.reviewsTitle}
          </SectionHeading>
        </div>

        {reviews.length === 0 ? (
          /* Empty state */
          <div className="py-12 text-center">
            <Star size={32} className="mx-auto text-stone-300 mb-3" />
            <p className="text-stone-400 text-sm">{t.noReviews}</p>
            <p className="text-stone-400 text-xs mt-1">{t.beTheFirst}</p>
          </div>
        ) : (
          <>
            {/* Aggregate rating distribution */}
            {reviewStats && reviewStats.total_reviews > 0 && (
              <RatingDistribution
                stats={reviewStats}
                reviewCountLabel={t.reviewCount}
              />
            )}

            {/* Review cards */}
            <div className="space-y-2 lg:space-y-3">
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

            {/* Show all / show fewer toggle */}
            {reviews.length > 3 && (
              <Button
                variant="outline"
                size="md"
                onClick={() => setShowAll(!showAll)}
                className="w-full mt-3 lg:mt-4"
              >
                {showAll
                  ? t.showFewerReviews
                  : `${t.showAllReviews} (${reviews.length})`}
              </Button>
            )}
          </>
        )}
      </div>
    );
  }
);

ReviewsSection.displayName = 'ReviewsSection';

export { ReviewsSection };
