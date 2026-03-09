'use client';

import React from 'react';
import { LOCALES } from '@/lib/i18n';
import type { Locale } from '@/lib/i18n';
import { LOCALE_LABELS } from '../_lib/translations';
import { cn } from '@/app/components/ui/_lib/cn';

export interface LanguageSwitcherProps {
  locale: Locale;
  onSwitch: (locale: Locale) => void;
  className?: string;
}

const LanguageSwitcher = React.forwardRef<HTMLDivElement, LanguageSwitcherProps>(
  ({ locale, onSwitch, className }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex bg-white/90 backdrop-blur rounded-full p-0.5',
          className
        )}
      >
        {LOCALES.map((loc) => (
          <button
            key={loc}
            onClick={() => onSwitch(loc)}
            className={cn(
              'px-2.5 py-1 rounded-full text-xs font-semibold transition-colors',
              locale === loc
                ? 'bg-primary text-white'
                : 'bg-stone-200 text-stone-600'
            )}
          >
            {LOCALE_LABELS[loc]}
          </button>
        ))}
      </div>
    );
  }
);

LanguageSwitcher.displayName = 'LanguageSwitcher';

export { LanguageSwitcher };
