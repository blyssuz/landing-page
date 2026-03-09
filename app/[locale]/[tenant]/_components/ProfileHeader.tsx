'use client';

import { useState, useEffect } from 'react';
import { Phone, MapPin, Share2, Check } from 'lucide-react';
import { Avatar } from '@/app/components/ui/Avatar';
import { Button } from '@/app/components/ui/Button';
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
  distance,
  distanceLoading,
  translations: t,
}: ProfileHeaderProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  const handleShare = async () => {
    const shareData = { title: business.name, url: window.location.href };
    if (navigator.share && navigator.canShare?.(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          console.error('[ProfileHeader] share failed:', err);
        }
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
    }
  };

  const hasLocation = !!(business.location?.lat && business.location?.lng);

  return (
    <div className="text-center px-4 pt-4 pb-2">
      {/* Top bar */}
      <div className="flex justify-between items-center mb-6">
        <LanguageSwitcher locale={locale} onSwitch={onSwitchLocale} />
        <div />
      </div>

      {/* Avatar */}
      <Avatar
        src={business.avatar_url || undefined}
        name={business.name}
        size="xl"
        className="w-[88px] h-[88px] text-2xl ring-4 ring-white shadow-lg mx-auto"
      />

      {/* Business name */}
      <h1 className="mt-4 text-2xl font-bold text-stone-900">
        {business.name}
      </h1>

      {/* Tagline */}
      {(business.tagline || business.bio) && (
        <p className="mt-1 text-sm text-stone-500">
          {business.tagline || business.bio}
        </p>
      )}

      {/* Status row */}
      <div className="flex items-center justify-center gap-1.5 text-sm mt-2">
        <span
          className={cn(
            'w-2 h-2 rounded-full',
            openStatus ? 'bg-emerald-500' : 'bg-red-400'
          )}
        />
        <span className="text-stone-600">
          {openStatus && closingTime
            ? t.openUntil.replace('{{time}}', closingTime)
            : t.closedNow}
        </span>

        {business.review_stats && (
          <>
            <span className="text-stone-300">&middot;</span>
            <StarRating
              rating={business.review_stats.average_rating}
              size="sm"
            />
            <span className="text-stone-500">
              ({business.review_stats.total_reviews})
            </span>
          </>
        )}

        {distance && (
          <>
            <span className="text-stone-300">&middot;</span>
            <span className="text-stone-500">
              {distance.distance} {distance.metric}
            </span>
          </>
        )}
      </div>

      {/* Book button */}
      <Button
        variant="primary"
        size="lg"
        className="w-full rounded-xl py-3.5 mt-5 text-base font-semibold"
        onClick={onBook}
      >
        {t.bookNow}
      </Button>

      {/* Quick action row */}
      <div className="grid grid-cols-3 gap-3 mt-4">
        {/* Call */}
        <a
          href={`tel:${business.business_phone_number}`}
          className="flex flex-col items-center gap-1.5 py-3 rounded-xl bg-stone-50 active:bg-stone-100 transition-colors"
        >
          <Phone size={20} className="text-stone-700" />
          <span className="text-xs font-medium text-stone-600">{t.call}</span>
        </a>

        {/* Map */}
        {hasLocation ? (
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${business.location!.lat},${business.location!.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-1.5 py-3 rounded-xl bg-stone-50 active:bg-stone-100 transition-colors"
          >
            <MapPin size={20} className="text-stone-700" />
            <span className="text-xs font-medium text-stone-600">{t.map}</span>
          </a>
        ) : (
          <div className="flex flex-col items-center gap-1.5 py-3 rounded-xl bg-stone-50 opacity-40 cursor-not-allowed">
            <MapPin size={20} className="text-stone-400" />
            <span className="text-xs font-medium text-stone-400">{t.map}</span>
          </div>
        )}

        {/* Share */}
        <button
          onClick={handleShare}
          className="flex flex-col items-center gap-1.5 py-3 rounded-xl bg-stone-50 active:bg-stone-100 transition-colors"
        >
          {copied ? (
            <>
              <Check size={20} className="text-emerald-600" />
              <span className="text-xs font-medium text-emerald-600">
                {t.linkCopied}
              </span>
            </>
          ) : (
            <>
              <Share2 size={20} className="text-stone-700" />
              <span className="text-xs font-medium text-stone-600">
                {t.share}
              </span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
