'use client';

import React from 'react';
import { cn } from '@/app/components/ui/_lib/cn';

export interface SectionHeadingProps
  extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: 'h1' | 'h2' | 'h3' | 'h4';
  size?: 'sm' | 'md' | 'lg';
}

const SectionHeading = React.forwardRef<HTMLHeadingElement, SectionHeadingProps>(
  (
    { className, as: Tag = 'h2', size = 'md', ...props },
    ref
  ) => {
    const baseClasses = 'font-bold tracking-tight text-stone-900 text-balance';

    const sizeClasses =
      size === 'sm'
        ? 'text-lg'
        : size === 'lg'
          ? 'text-2xl md:text-3xl'
          : 'text-xl md:text-2xl';

    return (
      <Tag
        className={cn(baseClasses, sizeClasses, className)}
        ref={ref}
        {...props}
      />
    );
  }
);

SectionHeading.displayName = 'SectionHeading';

export { SectionHeading };
