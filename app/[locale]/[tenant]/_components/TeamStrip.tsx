'use client';

import { Avatar } from '@/app/components/ui/Avatar';
import type { Employee, Locale } from '../_lib/types';

interface TeamStripProps {
  employees: Employee[];
  locale: Locale;
  translations: { specialists: string };
}

export function TeamStrip({ employees, translations: t }: TeamStripProps) {
  if (employees.length <= 1) return null;

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold text-stone-900 mb-4">{t.specialists}</h2>
      <div className="flex gap-4 overflow-x-auto scrollbar-hide -mx-1 px-1">
        {employees.map((employee) => {
          const name = [employee.first_name, employee.last_name].filter(Boolean).join(' ');
          const displayName = name || employee.position;
          const avatarName = employee.first_name || employee.position || '?';

          return (
            <div key={employee.id} className="flex flex-col items-center flex-shrink-0">
              <Avatar
                name={avatarName}
                size="xl"
                className="w-14 h-14 text-sm"
              />
              <p className="text-xs font-medium text-stone-900 mt-1.5 text-center line-clamp-1 w-16">
                {displayName}
              </p>
              {name && employee.position && (
                <p className="text-[11px] text-stone-500 text-center line-clamp-1 w-16 mt-0.5">
                  {employee.position}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
