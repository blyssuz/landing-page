'use client';

import { Avatar } from '@/app/components/ui/Avatar';
import type { Business } from '../../_lib/types';

export interface HeroEmptyProps {
  business: Business;
}

export function HeroEmpty({ business }: HeroEmptyProps) {
  return (
    <div
      className="w-full h-[200px] lg:h-[300px] flex items-center justify-center"
      style={{
        background: `linear-gradient(135deg, color-mix(in srgb, var(--primary) 10%, white) 0%, color-mix(in srgb, var(--primary) 5%, #fafaf9) 100%)`,
      }}
    >
      <div className="flex flex-col items-center gap-3">
        <Avatar
          src={business.avatar_url || undefined}
          name={business.name}
          size="xl"
          className="ring-4 ring-white shadow-lg"
        />
        <h1 className="text-xl lg:text-2xl font-bold text-stone-900 tracking-tight text-center px-4">
          {business.name}
        </h1>
        {business.tagline && (
          <p className="text-sm text-stone-500 text-center px-4">
            {business.tagline}
          </p>
        )}
      </div>
    </div>
  );
}
