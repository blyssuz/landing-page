'use client';

import React from 'react';
import { cn } from '@/app/components/ui/_lib/cn';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'primary';
  size?: 'sm' | 'md';
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  (
    { className, variant = 'default', size = 'md', ...props },
    ref
  ) => {
    const baseClasses = 'inline-flex items-center gap-1 rounded-lg font-medium';

    const variantClasses =
      variant === 'success'
        ? 'bg-emerald-50 text-emerald-700'
        : variant === 'warning'
          ? 'bg-amber-50 text-amber-700'
          : variant === 'primary'
            ? 'bg-primary/10 text-primary'
            : 'bg-stone-100 text-stone-700';

    const sizeClasses =
      size === 'sm'
        ? 'text-xs px-2 py-0.5'
        : 'text-sm px-2.5 py-1';

    return (
      <span
        className={cn(baseClasses, variantClasses, sizeClasses, className)}
        ref={ref}
        {...props}
      />
    );
  }
);

Badge.displayName = 'Badge';

export { Badge };
