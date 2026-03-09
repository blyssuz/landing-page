'use client';

import React from 'react';
import { cn } from '@/app/components/ui/_lib/cn';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, variant = 'text', width, height, style, ...props }, ref) => {
    const baseClasses =
      'bg-gradient-to-r from-stone-200 via-stone-100 to-stone-200 bg-[length:200%_100%] animate-[shimmer_1.5s_ease-in-out_infinite]';

    const variantClasses =
      variant === 'circular'
        ? 'rounded-full'
        : variant === 'rectangular'
          ? 'rounded-2xl'
          : 'rounded-md h-4';

    const dimensionStyle: React.CSSProperties = {
      ...style,
      ...(width != null && {
        width: typeof width === 'number' ? `${width}px` : width,
      }),
      ...(height != null && {
        height: typeof height === 'number' ? `${height}px` : height,
      }),
      ...(variant === 'circular' &&
        width != null &&
        height == null && {
          height: typeof width === 'number' ? `${width}px` : width,
        }),
    };

    return (
      <div
        className={cn(baseClasses, variantClasses, className)}
        style={dimensionStyle}
        ref={ref}
        aria-hidden="true"
        {...props}
      />
    );
  }
);

Skeleton.displayName = 'Skeleton';

export { Skeleton };
