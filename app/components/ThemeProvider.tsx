'use client';

import { useEffect } from 'react';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    document.documentElement.setAttribute('data-color-scheme', 'light');
  }, []);

  return <>{children}</>;
}
