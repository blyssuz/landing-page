'use client';

import React from 'react';
import { Avatar } from '@/app/components/ui/Avatar';
import { cn } from '@/app/components/ui/_lib/cn';
import type { Business } from '../_lib/types';
import type { Locale } from '@/lib/i18n';
import { MetadataBadges } from './MetadataBadges';
import type { MetadataBadgesProps } from './MetadataBadges';
import { LanguageSwitcher } from './LanguageSwitcher';

export interface BusinessHeaderProps {
  business: Business;
  hasPhotos: boolean;
  locale: Locale;
  onSwitchLocale: (locale: Locale) => void;
  metadataBadgesProps: Omit<MetadataBadgesProps, never>;
}

const BusinessHeader = React.forwardRef<HTMLDivElement, BusinessHeaderProps>(
  ({ business, hasPhotos, locale, onSwitchLocale, metadataBadgesProps }, ref) => {
    if (hasPhotos) {
      return (
        <div ref={ref}>
          {/* Desktop: full header below hero */}
          <div className="hidden lg:block pt-8 pb-4 border-b border-stone-100">
            <div className="flex items-start gap-3">
              <Avatar
                src={business.avatar_url || undefined}
                name={business.name}
                size="lg"
                className="ring-2 ring-white shadow"
              />
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl font-bold text-stone-900 leading-tight tracking-tight truncate">
                  {business.name}
                </h1>
                {business.tagline && (
                  <p className="text-sm text-stone-500 mt-0.5">
                    {business.tagline}
                  </p>
                )}
              </div>
            </div>
            <MetadataBadges {...metadataBadgesProps} />
          </div>

          {/* Mobile: compact metadata strip only (avatar/name shown in carousel overlay) */}
          <div className="lg:hidden pt-3 pb-2.5">
            <MetadataBadges {...metadataBadgesProps} />
          </div>
        </div>
      );
    }

    // No photos: full header with avatar + name + tagline + badges
    return (
      <div
        ref={ref}
        className="bg-white border-b border-stone-100"
      >
        <div className="max-w-[1350px] mx-auto px-4 lg:px-6 py-4 lg:py-10">
          <div className="flex items-center gap-3 lg:gap-5">
            <Avatar
              src={business.avatar_url || undefined}
              name={business.name}
              size="xl"
              className={cn(
                'w-14 h-14 lg:w-24 lg:h-24',
                business.avatar_url && 'ring-2 lg:ring-4 ring-white shadow-lg'
              )}
            />
            <div className="flex-1 min-w-0">
              <h1 className="text-lg lg:text-3xl font-bold text-stone-900 leading-tight tracking-tight truncate">
                {business.name}
              </h1>
              {business.tagline && (
                <p className="text-xs lg:text-sm text-stone-500 mt-0.5">
                  {business.tagline}
                </p>
              )}
              <MetadataBadges {...metadataBadgesProps} />
            </div>
            <div className="flex-shrink-0 self-start">
              <LanguageSwitcher locale={locale} onSwitch={onSwitchLocale} />
            </div>
          </div>
        </div>
      </div>
    );
  }
);

BusinessHeader.displayName = 'BusinessHeader';

export { BusinessHeader };
