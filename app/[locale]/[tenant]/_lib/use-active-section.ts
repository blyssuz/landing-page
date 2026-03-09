'use client';

import { useState, useEffect } from 'react';

/**
 * Custom hook that tracks which section is currently visible in the viewport
 * using IntersectionObserver. Used by TabNavigation to highlight the active tab.
 *
 * @param sectionRefs - Record mapping section IDs to their element refs
 * @returns The ID of the currently active (visible) section
 */
export function useActiveSection(
  sectionRefs: Record<string, React.RefObject<HTMLElement | null>>
): string {
  const [activeSection, setActiveSection] = useState('services');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const match = Object.entries(sectionRefs).find(
              ([, ref]) => ref.current === entry.target
            );
            if (match) {
              setActiveSection(match[0]);
            }
          }
        }
      },
      { rootMargin: '-80px 0px -60% 0px', threshold: 0 }
    );

    Object.values(sectionRefs).forEach((ref) => {
      if (ref.current) observer.observe(ref.current);
    });

    return () => observer.disconnect();
  }, [sectionRefs]);

  return activeSection;
}
