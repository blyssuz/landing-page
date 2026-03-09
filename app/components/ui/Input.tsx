'use client';

import React from 'react';
import { cn } from '@/app/components/ui/_lib/cn';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: 'default' | 'filled';
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    const baseClasses =
      'w-full rounded-xl border px-4 py-2.5 text-base text-stone-900 placeholder:text-stone-400 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed';

    const variantClasses =
      variant === 'filled'
        ? 'bg-stone-50 border-transparent focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary/20 focus:outline-none'
        : 'border-stone-200 bg-white focus:border-primary focus:ring-1 focus:ring-primary/20 focus:outline-none';

    return (
      <input
        className={cn(baseClasses, variantClasses, className)}
        ref={ref}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';

export { Input };
