'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, ChevronDown } from 'lucide-react';
import { springs } from '@/lib/animations';
import { secondsToTime, getTodayKey } from '../_lib/utils';
import { DAY_ORDER } from '../_lib/translations';

interface WorkingHoursProps {
  workingHours: Record<string, { start: number; end: number; is_open: boolean }>;
  dayNames: Record<string, string>;
  closedLabel: string;
  title: string;
  openUntilText?: string;
  variant?: 'inline' | 'collapsible';
}

function DaySchedule({
  workingHours,
  dayNames,
  closedLabel,
}: {
  workingHours: Record<string, { start: number; end: number; is_open: boolean }>;
  dayNames: Record<string, string>;
  closedLabel: string;
}) {
  const todayKey = getTodayKey();

  return (
    <div className="space-y-1">
      {DAY_ORDER.map((day) => {
        const hours = workingHours[day];
        const isToday = day === todayKey;
        return (
          <div
            key={day}
            className={`flex justify-between text-sm py-2 px-3 rounded-lg transition-colors ${
              isToday ? 'bg-primary/10' : ''
            }`}
          >
            <span
              className={
                isToday
                  ? 'font-medium text-primary'
                  : hours?.is_open
                    ? 'text-stone-600'
                    : 'text-stone-400'
              }
            >
              {dayNames[day]}
            </span>
            <span
              className={
                isToday
                  ? 'font-medium text-primary'
                  : hours?.is_open
                    ? 'text-stone-900'
                    : 'text-stone-400'
              }
            >
              {hours?.is_open
                ? `${secondsToTime(hours.start)} \u2013 ${secondsToTime(hours.end)}`
                : closedLabel}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export function WorkingHours({
  workingHours,
  dayNames,
  closedLabel,
  title,
  openUntilText,
  variant = 'inline',
}: WorkingHoursProps) {
  const [expanded, setExpanded] = useState(false);

  if (variant === 'inline') {
    return (
      <div>
        <h4 className="text-base font-semibold text-stone-900 mb-3">{title}</h4>
        <DaySchedule
          workingHours={workingHours}
          dayNames={dayNames}
          closedLabel={closedLabel}
        />
      </div>
    );
  }

  // Collapsible variant (mobile)
  return (
    <div className="bg-white rounded-xl border border-stone-100 overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-3.5"
      >
        <div className="flex items-center gap-2.5">
          <Clock size={16} className="text-primary" />
          <span className="text-sm font-semibold text-stone-900">{title}</span>
        </div>
        <div className="flex items-center gap-2">
          {openUntilText && (
            <span className="text-xs font-medium text-emerald-600">
              {openUntilText}
            </span>
          )}
          <motion.div
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown size={16} className="text-stone-400" />
          </motion.div>
        </div>
      </button>
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={springs.gentle}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4">
              <DaySchedule
                workingHours={workingHours}
                dayNames={dayNames}
                closedLabel={closedLabel}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
