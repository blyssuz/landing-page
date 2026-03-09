'use client';

import React from 'react';
import { cn } from '@/app/components/ui/_lib/cn';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'elevated' | 'flat' | 'outline';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hoverable?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      variant = 'elevated',
      padding = 'md',
      hoverable = false,
      ...props
    },
    ref
  ) => {
    const baseClasses = 'bg-white rounded-2xl transition-shadow duration-200';

    const variantClasses =
      variant === 'elevated'
        ? 'shadow-warm'
        : variant === 'flat'
          ? 'border border-stone-100'
          : 'border border-stone-200';

    const paddingClasses =
      padding === 'none'
        ? ''
        : padding === 'sm'
          ? 'p-3'
          : padding === 'lg'
            ? 'p-6'
            : 'p-4';

    const hoverClasses = hoverable
      ? 'hover:shadow-warm-md cursor-pointer'
      : '';

    return (
      <div
        className={cn(baseClasses, variantClasses, paddingClasses, hoverClasses, className)}
        ref={ref}
        {...props}
      />
    );
  }
);

Card.displayName = 'Card';

export { Card };
