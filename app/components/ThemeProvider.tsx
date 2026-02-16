'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function ThemeProviderWrapper({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();
  const colorScheme = searchParams.get('colorScheme');

  useEffect(() => {
    const root = document.documentElement;

    if (colorScheme === 'light' || colorScheme === 'dark') {
      sessionStorage.setItem('colorScheme', colorScheme);
      root.setAttribute('data-color-scheme', colorScheme);
      return;
    }

    // Check sessionStorage for previously set colorScheme (survives navigation)
    const stored = sessionStorage.getItem('colorScheme');
    if (stored === 'light' || stored === 'dark') {
      root.setAttribute('data-color-scheme', stored);
      return;
    }

    // No explicit param or stored value — detect system preference
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    root.setAttribute('data-color-scheme', mq.matches ? 'dark' : 'light');

    const handler = (e: MediaQueryListEvent) => {
      root.setAttribute('data-color-scheme', e.matches ? 'dark' : 'light');
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [colorScheme]);

  return <>{children}</>;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<>{children}</>}>
      <ThemeProviderWrapper>{children}</ThemeProviderWrapper>
    </Suspense>
  );
}
