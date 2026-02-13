'use client';

import React from 'react';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', ...props }, ref) => {
    const baseClasses =
      'inline-flex items-center justify-center font-medium transition-all duration-200 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

    const variantClasses =
      variant === 'primary'
        ? 'bg-black text-white hover:bg-gray-900 active:bg-gray-800 focus-visible:ring-black'
        : variant === 'outline'
          ? 'border-2 border-black text-black bg-transparent hover:bg-gray-50 active:bg-gray-100 focus-visible:ring-black'
          : 'text-black hover:bg-gray-100 active:bg-gray-200 focus-visible:ring-black';

    const sizeClasses =
      size === 'sm'
        ? 'px-3 py-1.5 text-sm'
        : size === 'lg'
          ? 'px-6 py-3 text-lg'
          : 'px-4 py-2 text-base';

    const finalClassName = `${baseClasses} ${variantClasses} ${sizeClasses} ${className}`.trim();

    return (
      <button className={finalClassName} ref={ref} {...props} />
    );
  }
);

Button.displayName = 'Button';

export { Button };
