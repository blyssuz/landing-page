'use client';

import React from 'react';
import { Avatar } from '@/app/components/ui/Avatar';
import type { Employee } from '../_lib/types';
import type { Locale } from '@/lib/i18n';

export interface TeamCardProps {
  employee: Employee;
  locale: Locale;
}

const TeamCard = React.forwardRef<HTMLDivElement, TeamCardProps>(
  ({ employee }, ref) => {
    const name = [employee.first_name, employee.last_name]
      .filter(Boolean)
      .join(' ');
    const displayName = name || employee.position;
    const avatarName = employee.first_name || employee.position || '?';

    return (
      <div
        ref={ref}
        className="flex flex-col items-center flex-shrink-0 w-[120px] lg:w-[140px] snap-start cursor-default"
      >
        <Avatar
          name={avatarName}
          size="xl"
          className="w-[72px] h-[72px] lg:w-[88px] lg:h-[88px]"
        />
        <p className="text-[15px] font-medium text-stone-900 mt-2.5 text-center line-clamp-1 w-full">
          {displayName}
        </p>
        {name && employee.position && (
          <p className="text-[13px] text-stone-500 text-center line-clamp-1 w-full mt-0.5">
            {employee.position}
          </p>
        )}
      </div>
    );
  }
);

TeamCard.displayName = 'TeamCard';

export { TeamCard };
