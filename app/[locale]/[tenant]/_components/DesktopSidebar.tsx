'use client';

import { useRouter } from 'next/navigation';
import { CalendarCheck, MapPin, ExternalLink } from 'lucide-react';
import { Button } from '@/app/components/ui/Button';
import { Card } from '@/app/components/ui/Card';
import { WorkingHours } from './WorkingHours';
import { ContactInfo } from './ContactInfo';
import type { Business, Locale, SavedUser } from '../_lib/types';
import { DAY_NAMES } from '../_lib/translations';

interface DesktopSidebarProps {
  business: Business;
  locale: Locale;
  savedUser: SavedUser | null;
  geoAddress: string | null;
  basePath: string;
  translations: Record<string, string>;
  servicesRef?: React.RefObject<HTMLElement | null>;
}

export function DesktopSidebar({
  business,
  locale,
  savedUser,
  geoAddress,
  basePath,
  translations,
  servicesRef,
}: DesktopSidebarProps) {
  const router = useRouter();
  const dayNames = DAY_NAMES[locale];

  return (
    <div className="hidden lg:block">
      <div className="sticky top-16 space-y-4 pt-6">
        {/* Book Now / My Bookings CTA */}
        {savedUser ? (
          <Button
            variant="primary"
            onClick={() => router.push(`${basePath}/bookings`)}
            className="w-full rounded-2xl py-3.5 text-base font-semibold gap-2 shadow-sm shadow-primary/20"
          >
            <CalendarCheck size={20} />
            {translations.myBookings}
          </Button>
        ) : (
          <Button
            variant="primary"
            onClick={() => servicesRef?.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
            className="w-full rounded-2xl py-3.5 text-base font-semibold gap-2 shadow-sm shadow-primary/20"
          >
            <CalendarCheck size={20} />
            {translations.bookNow}
          </Button>
        )}

        {/* Map */}
        <Card variant="flat" padding="none">
          <div className="aspect-[16/10] bg-stone-100 relative">
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
                <MapPin size={28} className="text-stone-300" />
              </div>
            )}
          </div>
          <div className="p-4">
            <p className="text-base font-semibold text-stone-900">{business.name}</p>
            {(geoAddress || business.location?.address) && (
              <p className="text-sm text-stone-500 mt-0.5 capitalize">
                {geoAddress || business.location?.address}
              </p>
            )}
            {business.location?.lat && business.location?.lng && (
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${business.location.lat},${business.location.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-medium mt-2 text-primary hover:underline"
              >
                {translations.getDirections}
                <ExternalLink size={12} />
              </a>
            )}
          </div>
        </Card>

        {/* Working Hours */}
        {business.working_hours && (
          <Card variant="flat">
            <WorkingHours
              workingHours={business.working_hours}
              dayNames={dayNames}
              closedLabel={translations.closed}
              title={translations.workingHours}
              variant="inline"
            />
          </Card>
        )}

        {/* Contact */}
        <Card variant="flat">
          <ContactInfo
            phone={business.business_phone_number}
            instagram={business.social_media?.instagram}
            translations={{
              call: translations.call,
              contact: translations.contact,
            }}
            variant="sidebar"
          />
        </Card>
      </div>
    </div>
  );
}
