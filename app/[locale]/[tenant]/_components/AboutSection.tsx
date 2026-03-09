'use client';

import React from 'react';
import { motion } from 'motion/react';
import type { Business, Locale } from '../_lib/types';

interface AboutSectionProps {
  business: Business;
  locale: Locale;
  translations: Record<string, string>;
}

const AboutSection = React.forwardRef<HTMLDivElement, AboutSectionProps>(
  ({ business, locale, translations }, ref) => {
    return (
      <motion.div
        ref={ref}
        className="space-y-3 scroll-mt-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        {/* Placeholder for future about content */}
      </motion.div>
    );
  }
);

AboutSection.displayName = 'AboutSection';

export { AboutSection };
