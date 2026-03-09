'use client';

import React from 'react';
import { User } from 'lucide-react';
import { SectionHeading } from '@/app/components/ui/SectionHeading';
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
        <div className="pb-3 lg:pb-4">
          <SectionHeading as="h2" size="md">
            {t.specialists}
          </SectionHeading>
        </div>

        {employees.length === 0 ? (
          /* Empty state */
          <div className="py-12 text-center">
            <User size={32} className="mx-auto text-stone-300 mb-3" />
            <p className="text-stone-400 text-sm">{t.noTeam}</p>
          </div>
        ) : (
          /* Team cards in horizontal scroll */
          <div
            className={cn(
              'flex gap-2.5 lg:gap-3 overflow-x-auto pb-3 scrollbar-hide snap-x snap-mandatory -mx-1 px-1',
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
