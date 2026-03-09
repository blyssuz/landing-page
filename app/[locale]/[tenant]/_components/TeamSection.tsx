'use client';

import React from 'react';
import { User } from 'lucide-react';
import { cn } from '@/app/components/ui/_lib/cn';
import type { Employee } from '../_lib/types';
import type { Locale } from '@/lib/i18n';
import { TeamCard } from './TeamCard';

export interface TeamSectionProps {
  employees: Employee[];
  locale: Locale;
  translations: {
    specialists: string;
    noTeam: string;
  };
}

const TeamSection = React.forwardRef<HTMLDivElement, TeamSectionProps>(
  ({ employees, locale, translations: t }, ref) => {
    return (
      <div ref={ref} className="scroll-mt-16">
        <h2 className="text-[24px] lg:text-[28px] font-semibold text-stone-900 leading-[32px] lg:leading-[36px] pb-4 lg:pb-5">
          {t.specialists}
        </h2>

        {employees.length === 0 ? (
          <div className="py-12 text-center">
            <User size={32} className="mx-auto text-stone-300 mb-3" />
            <p className="text-stone-400 text-[15px]">{t.noTeam}</p>
          </div>
        ) : (
          <div
            className={cn(
              'flex gap-3 lg:gap-4 overflow-x-auto pb-3 scrollbar-hide snap-x snap-mandatory -mx-1 px-1',
              employees.length <= 2 && 'justify-center'
            )}
          >
            {employees.map((employee) => (
              <TeamCard key={employee.id} employee={employee} locale={locale} />
            ))}
          </div>
        )}
      </div>
    );
  }
);

TeamSection.displayName = 'TeamSection';

export { TeamSection };
