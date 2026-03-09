'use client';

import { Avatar } from '@/app/components/ui/Avatar';
import { StarRating } from '@/app/components/ui/StarRating';
import { LanguageSwitcher } from './LanguageSwitcher';
import { cn } from '@/app/components/ui/_lib/cn';
import type { Business, Locale } from '../_lib/types';

interface ProfileHeaderProps {
  business: Business;
  locale: Locale;
  onSwitchLocale: (locale: Locale) => void;
  onBook: () => void;
  openStatus: boolean;
  closingTime: string | null;
  nextOpenText?: string;
  onStatusClick?: () => void;
  onReviewsClick?: () => void;
  onDistanceClick?: () => void;
  distance: { distance: number; metric: string } | null;
  distanceLoading: boolean;
  translations: Record<string, string>;
}

export function ProfileHeader({
  business,
  locale,
  onSwitchLocale,
  onBook,
  openStatus,
  closingTime,
  nextOpenText,
  onStatusClick,
  onReviewsClick,
  onDistanceClick,
  distance,
  distanceLoading,
  translations: t,
}: ProfileHeaderProps) {
  const hasAvatar = !!business.avatar_url;

  return (
    <div className={cn('px-4 pt-4 pb-2 text-left')}>
      {/* Top bar */}
      <div className="flex justify-between items-center mb-6">
        <div />
        <LanguageSwitcher locale={locale} onSwitch={onSwitchLocale} />
      </div>

      {/* Avatar */}
      {/* {hasAvatar && (
        <Avatar
          src={business.avatar_url!}
          name={business.name}
          size="xl"
          className="w-[88px] h-[88px] text-2xl ring-4 ring-white shadow-lg mx-auto"
        />
      )} */}

      {/* Business name */}
      <h1 className={cn('text-3xl xl:text-5xl font-bold text-stone-900')}>
        {business.name}
      </h1>

      {/* Tagline */}
      {(business.tagline || business.bio) && (
        <p className="mt-1 text-base text-stone-500">
          {business.tagline || business.bio}
        </p>
      )}

      {/* Status row */}
      <div className={cn('flex items-center gap-1.5 text-lg mt-2')}>
        <button
          type="button"
          onClick={onStatusClick}
          className="flex items-center gap-1.5 hover:opacity-70 transition-opacity"
        >
          <span
            className={cn(
              'w-3 h-3 rounded-full',
              openStatus ? 'bg-emerald-500' : 'bg-red-400'
            )}
          />
          <span className="text-stone-600">
            {openStatus && closingTime
              ? t.openUntil.replace('{{time}}', closingTime)
              : nextOpenText
                ? `${t.closedNow} · ${nextOpenText}`
                : t.closedNow}
          </span>
        </button>

        {business.review_stats && (
          <>
            <span className="text-stone-300">&middot;</span>
            <button
              type="button"
              onClick={onReviewsClick}
              className="flex items-center gap-1.5 hover:opacity-70 transition-opacity"
            >
              <StarRating
                rating={business.review_stats.average_rating}
              />
              <span className="font-medium text-stone-900">
                {business.review_stats.average_rating.toFixed(1)}
              </span>
              <span className="text-stone-500">
                ({business.review_stats.total_reviews} {t.reviewCount})
              </span>
            </button>
          </>
        )}

        {distance && (
          <>
            <span className="text-stone-300">&middot;</span>
            <button
              type="button"
              onClick={onDistanceClick}
              className="text-stone-500 hover:opacity-70 transition-opacity"
            >
              {t.distanceAway.replace('{{distance}}', `${distance.distance} ${distance.metric}`)}
            </button>
          </>
        )}
      </div>

    </div>
  );
}
