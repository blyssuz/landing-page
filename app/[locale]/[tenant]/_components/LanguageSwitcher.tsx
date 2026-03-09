'use client';

import React from 'react';
import { LOCALES } from '@/lib/i18n';
import type { Locale } from '@/lib/i18n';
import { cn } from '@/app/components/ui/_lib/cn';

const FLAG: Record<Locale, string> = {
  uz: '🇺🇿',
  ru: '🇷🇺',
};

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
          'inline-flex border border-stone-200 rounded-full overflow-hidden',
          className
        )}
      >
        {LOCALES.map((loc) => (
          <button
            key={loc}
            onClick={() => onSwitch(loc)}
            className={cn(
              'px-3.5 py-1  text-lg transition-colors',
              locale === loc
                ? 'bg-[var(--primary)]'
                : 'bg-white hover:bg-stone-50'
            )}
          >
            {FLAG[loc]}
          </button>
        ))}
      </div>
    );
  }
);

LanguageSwitcher.displayName = 'LanguageSwitcher';

export { LanguageSwitcher };
