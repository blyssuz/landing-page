'use client';

import React from 'react';
import { cn } from './_lib/cn';

export interface PillButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  children: React.ReactNode;
}

const PillButton = React.forwardRef<HTMLButtonElement, PillButtonProps>(
  ({ active = false, children, className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center px-4 py-2 rounded-full font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.98]',
          active
            ? 'bg-primary text-white focus-visible:ring-primary'
            : 'bg-stone-100 text-stone-700 hover:bg-stone-200 active:bg-stone-300 focus-visible:ring-stone-400',
          className,
        )}
        {...props}
      >
        {children}
      </button>
    );
  },
);

PillButton.displayName = 'PillButton';

export { PillButton };
