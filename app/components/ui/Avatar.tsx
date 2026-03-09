'use client';

import React from 'react';
import { cn } from '@/app/components/ui/_lib/cn';

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const gradients = [
  'from-rose-400 to-orange-300',
  'from-violet-400 to-purple-300',
  'from-cyan-400 to-blue-300',
  'from-emerald-400 to-teal-300',
  'from-amber-400 to-yellow-300',
];

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, alt, name, size = 'md', ...props }, ref) => {
    const baseClasses =
      'rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center ring-2 ring-white';

    const sizeClasses =
      size === 'sm'
        ? 'w-8 h-8 text-xs'
        : size === 'lg'
          ? 'w-12 h-12 text-base'
          : size === 'xl'
            ? 'w-16 h-16 text-lg'
            : 'w-10 h-10 text-sm';

    const gradientIndex = name.charCodeAt(0) % gradients.length;
    const gradient = gradients[gradientIndex];

    return (
      <div
        className={cn(
          baseClasses,
          sizeClasses,
          !src && `bg-gradient-to-br ${gradient}`,
          className
        )}
        ref={ref}
        {...props}
      >
        {src ? (
          <img
            src={src}
            alt={alt || name}
            className="w-full h-full object-cover rounded-full"
          />
        ) : (
          <span className="font-medium text-white select-none">
            {name.charAt(0).toUpperCase()}
          </span>
        )}
      </div>
    );
  }
);

Avatar.displayName = 'Avatar';

export { Avatar };
