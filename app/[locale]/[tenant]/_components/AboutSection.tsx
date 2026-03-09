'use client';

import React from 'react';
import { motion } from 'motion/react';
import { MapPin, ExternalLink } from 'lucide-react';
import { Card } from '@/app/components/ui/Card';
import { WorkingHours } from './WorkingHours';
import { ContactInfo } from './ContactInfo';
import type { Business, Locale } from '../_lib/types';
import { DAY_NAMES } from '../_lib/translations';
import { getClosingTime, isOpenNow } from '../_lib/utils';

interface AboutSectionProps {
  business: Business;
  locale: Locale;
  geoAddress: string | null;
  translations: Record<string, string>;
}

const AboutSection = React.forwardRef<HTMLDivElement, AboutSectionProps>(
  ({ business, locale, geoAddress, translations }, ref) => {
    const dayNames = DAY_NAMES[locale];
    const openStatus = isOpenNow(business.working_hours);
    const closingTime = getClosingTime(business.working_hours);

    const openUntilText =
      openStatus && closingTime
        ? translations.openUntil.replace('{{time}}', closingTime)
        : undefined;

    return (
      <motion.div
        ref={ref}
        className="lg:hidden space-y-3 scroll-mt-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        {/* Map */}
        <Card variant="flat" padding="none">
          <div className="aspect-[16/9] bg-stone-100">
            {business.location?.lat && business.location?.lng ? (
              <iframe
                src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${business.location.lat},${business.location.lng}&zoom=15`}
                className="w-full h-full border-0"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <MapPin size={24} className="text-stone-300" />
              </div>
            )}
          </div>
          <div className="p-3.5">
            <p className="text-sm font-semibold text-stone-900">{business.name}</p>
            {(geoAddress || business.location?.address) && (
              <p className="text-xs text-stone-500 mt-0.5 capitalize">
                {geoAddress || business.location?.address}
              </p>
            )}
            {business.location?.lat && business.location?.lng && (
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${business.location.lat},${business.location.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-medium mt-1.5 text-primary hover:underline"
              >
                {translations.getDirections}
                <ExternalLink size={11} />
              </a>
            )}
          </div>
        </Card>

        {/* Call + Instagram */}
        <ContactInfo
          phone={business.business_phone_number}
          instagram={business.social_media?.instagram}
          translations={{
            call: translations.call,
            contact: translations.contact,
          }}
          variant="mobile"
        />

        {/* Working Hours (collapsible) */}
        {business.working_hours && (
          <WorkingHours
            workingHours={business.working_hours}
            dayNames={dayNames}
            closedLabel={translations.closed}
            title={translations.workingHours}
            openUntilText={openUntilText}
            variant="collapsible"
          />
        )}
      </motion.div>
    );
  }
);

AboutSection.displayName = 'AboutSection';

export { AboutSection };
