'use client';

import React from 'react';
import { Star, MapPin } from 'lucide-react';
import { Badge } from '@/app/components/ui/Badge';
import type { ReviewStats } from '../_lib/types';

export interface MetadataBadgesProps {
  openStatus: boolean;
  closingTime: string | null;
  distance: { distance: number; metric: string } | null;
  distanceLoading: boolean;
  distanceDenied: boolean;
  onRequestDistance: () => void;
  reviewStats: ReviewStats | null;
  translations: {
    openUntil: string;
    closedNow: string;
    distanceAway: string;
    showDistance: string;
  };
}

const MetadataBadges = React.forwardRef<HTMLDivElement, MetadataBadgesProps>(
  (
    {
      openStatus,
      closingTime,
      distance,
      distanceLoading,
      distanceDenied,
      onRequestDistance,
      reviewStats,
      translations: t,
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className="flex flex-wrap items-center gap-x-1.5 lg:gap-x-2 gap-y-1 mt-1.5 lg:mt-2"
      >
        {/* Open/Closed status badge */}
        {openStatus && closingTime ? (
          <Badge variant="success" size="sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            {t.openUntil.replace('{{time}}', closingTime)}
          </Badge>
        ) : (
          <Badge variant="warning" size="sm">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            {t.closedNow}
          </Badge>
        )}

        {/* Rating badge */}
        {reviewStats && reviewStats.total_reviews > 0 && (
          <>
            <span className="text-stone-300">&middot;</span>
            <Badge variant="default" size="sm">
              <Star size={12} className="fill-amber-400 text-amber-400" />
              <span className="font-semibold text-stone-900">
                {reviewStats.average_rating}
              </span>
              <span className="text-stone-500">
                ({reviewStats.total_reviews})
              </span>
            </Badge>
          </>
        )}

        {/* Distance badge: loading */}
        {distanceLoading && (
          <>
            <span className="text-stone-300">&middot;</span>
            <span className="inline-block w-20 h-5 bg-stone-200 rounded-lg animate-[shimmer_1.5s_infinite]" />
          </>
        )}

        {/* Distance badge: available */}
        {distance && !distanceLoading && (
          <>
            <span className="text-stone-300">&middot;</span>
            <Badge variant="default" size="sm">
              <MapPin size={12} className="shrink-0" />
              {t.distanceAway.replace(
                '{{distance}}',
                `${distance.distance} ${distance.metric}`
              )}
            </Badge>
          </>
        )}

        {/* Distance badge: denied */}
        {distanceDenied && !distance && !distanceLoading && (
          <>
            <span className="text-stone-300">&middot;</span>
            <button
              onClick={onRequestDistance}
              className="inline-flex items-center gap-1 text-xs text-primary hover:underline font-medium"
            >
              <MapPin size={12} />
              {t.showDistance}
            </button>
          </>
        )}
      </div>
    );
  }
);

MetadataBadges.displayName = 'MetadataBadges';

export { MetadataBadges };
