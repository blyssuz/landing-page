'use client';

import React from 'react';

export interface PillButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  children: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const PillButton = React.forwardRef<HTMLButtonElement, PillButtonProps>(
  ({ active = false, children, className = '', ...props }, ref) => {
    const baseClasses =
      'inline-flex items-center justify-center px-4 py-2 rounded-full font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2';

    const stateClasses = active
      ? 'bg-black text-white focus-visible:ring-black'
      : 'bg-gray-100 text-black hover:bg-gray-200 active:bg-gray-300 focus-visible:ring-gray-400';

    const finalClassName = `${baseClasses} ${stateClasses} ${className}`.trim();

    return (
      <button ref={ref} className={finalClassName} {...props}>
        {children}
      </button>
    );
  }
);

PillButton.displayName = 'PillButton';

export { PillButton };
