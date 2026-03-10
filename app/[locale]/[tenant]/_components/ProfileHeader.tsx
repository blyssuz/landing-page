'use client';

import { MapPin } from 'lucide-react';
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
  geoAddress: string | null;
  closingTime: string | null;
  nextOpenText?: string;
  onStatusClick?: () => void;
  onReviewsClick?: () => void;
  onDistanceClick?: () => void;
  distance: { distance: number; metric: string } | null;
  distanceLoading: boolean;
  translations: Record<string, string>;
  minimal?: boolean;
}

export function ProfileHeader({
  business,
  locale,
  onSwitchLocale,
  onBook,
  openStatus,
  closingTime,
  geoAddress,
  nextOpenText,
  onStatusClick,
  onReviewsClick,
  onDistanceClick,
  distance,
  distanceLoading,
  translations: t,
  minimal,
}: ProfileHeaderProps) {
  const hasAvatar = !!business.avatar_url;

  if (minimal) {
    return (
      <div className={cn('px-4 pt-4 pb-2 text-left')}>
        <div className="flex justify-end items-center">
          <LanguageSwitcher locale={locale} onSwitch={onSwitchLocale} />
        </div>
      </div>
    );
  }

  return (
    <div className={cn('px-4 pt-4 pb-2 text-left')}>
      {/* Top bar */}
      <div className="flex justify-between items-center mb-6">
        <button
          type="button"
          onClick={() => document.getElementById('location')?.scrollIntoView({ behavior: 'smooth' })}
          className="w-9 h-9 flex items-center justify-center rounded-full border border-stone-200 hover:bg-stone-50 transition-colors"
        >
          <MapPin size={18} className="text-stone-600" />
        </button>
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

      {geoAddress && (
        <div className="text-stone-600 mt-2">
          {geoAddress}
{}        </div>
      )}

      {/* Tagline */}
      {/* {(business.tagline || business.bio) && (
        <p className="mt-1 text-base text-stone-500">
          {business.tagline || business.bio}
        </p>
      )} */}

      {/* Status row */}
      <div className="mt-1 space-y-1">

        {/* Reviews */}
        {business.review_stats && (
          <button
            type="button"
            onClick={onReviewsClick}
            className="flex items-center gap-1.5 text-base hover:opacity-70 transition-opacity"
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
        )}

        {/* Open/closed status */}
        <button
          type="button"
          onClick={onStatusClick}
          className="flex items-center gap-1.5 text-base hover:opacity-70 transition-opacity"
        >
          <span
            className={cn(
              'w-2.5 h-2.5 rounded-full flex-shrink-0',
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

        {/* Distance */}
        {distance && (
          <button
            type="button"
            onClick={onDistanceClick}
            className="text-base text-stone-500 hover:opacity-70 transition-opacity"
          >
            {t.distanceAway.replace('{{distance}}', `${distance.distance} ${distance.metric}`)}
          </button>
        )}
      </div>

    </div>
  );
}
