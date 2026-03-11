'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin } from 'lucide-react';
import { setBookingIntent } from './actions';
import type { TenantPageProps, Service } from './_lib/types';
import type { Locale } from '@/lib/i18n';
import { UI_TEXT, DAY_NAMES } from './_lib/translations';
import { isOpenNow, getClosingTime, getNextOpenInfo } from './_lib/utils';
import { useDistance } from './_lib/use-distance';
import { GalleryLightbox } from './_components/HeroGallery/GalleryLightbox';
import { ProfileHeader } from './_components/ProfileHeader';
import { PhotoStrip } from './_components/PhotoStrip';
import { ServicesSection } from './_components/ServicesSection';
import { TeamStrip } from './_components/TeamStrip';
import { ReviewsSection } from './_components/ReviewsSection';
import { AboutSection } from './_components/AboutSection';
import { DaySchedule } from './_components/WorkingHours';
import { LocationMap } from './_components/LocationMap';
import { ChatWidget } from './_components/ChatWidget';

export function TenantPage({ business, services, employees, photos, reviews, tenantSlug, businessId, locale, savedUser, isFromInstagram }: TenantPageProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { distance, distanceLoading, distanceDenied, geoAddress, fetchDistance, showLocationModal, setShowLocationModal } = useDistance(business, locale);

  const [showGallery, setShowGallery] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [bookingServiceId, setBookingServiceId] = useState<string | null>(null);
  const [showHoursModal, setShowHoursModal] = useState(false);

  const primaryColor = business.primary_color || '#088395';
  const openStatus = isOpenNow(business.working_hours);
  const closingTime = getClosingTime(business.working_hours);
  const nextOpen = !openStatus ? getNextOpenInfo(business.working_hours) : null;
  const t = UI_TEXT[locale];
  const dayNames = DAY_NAMES[locale];
  const hasPhotos = photos.length > 0;
  const pathSegments = pathname.split('/').filter(Boolean);
  const basePath = pathSegments[1] === 'b' ? `/${locale}/b/${pathSegments[2]}` : `/${locale}`;

  const switchLocale = (newLocale: Locale) => {
    const segments = pathname.split('/').filter(Boolean);
    if (segments[1] === 'b') { router.push(`/${newLocale}/${segments.slice(1).join('/')}`); }
    else { const rest = segments.slice(2); router.push(`/${newLocale}${rest.length > 0 ? '/' + rest.join('/') : ''}`); }
  };

  const handleBookService = async (service: Service) => {
    setBookingServiceId(service.id);
    document.cookie = `blyss_booking_${businessId}=; path=/; max-age=0`;
    await setBookingIntent(businessId, [service.id]);
    router.push(`${basePath}/booking`);
  };

  const allPhotos = photos.map((p) => ({ url: p.url, category: p.category }));
  const openGallery = (i: number) => { setCurrentImageIndex(i); setShowGallery(true); };

  return (
 <div className=''>
     <div className="bg-white min-h-screen max-w-3xl lg:px-3 mx-auto shadow-lg" style={{ '--primary': primaryColor } as React.CSSProperties}>
     
     {/* Profile Header */}
      <ProfileHeader
        business={business}
        locale={locale}
        onSwitchLocale={switchLocale}
        onBook={() => router.push(`${basePath}/booking`)}
        openStatus={openStatus}
        closingTime={closingTime}
        nextOpenText={nextOpen ? t.opensAt.replace('{{day}}', dayNames[nextOpen.dayKey]).replace('{{time}}', nextOpen.time) : undefined}
        onStatusClick={() => setShowHoursModal(true)}
        onReviewsClick={() => document.getElementById('reviews')?.scrollIntoView({ behavior: 'smooth' })}
        onDistanceClick={() => document.getElementById('location')?.scrollIntoView({ behavior: 'smooth' })}
        distance={distance}
        distanceLoading={distanceLoading}
        translations={t}
        geoAddress={geoAddress}
        minimal={isFromInstagram}
      />

      {/* Photo Strip */}
      {/* {hasPhotos && <PhotoStrip photos={photos} onPhotoClick={openGallery} />} */}

      {/* Main Content -- single column, no sidebar */}
      <div className="px-4 pb-24">

        {/* Services section */}
        <div className="pt-6">
          <ServicesSection
            services={services}
            locale={locale}
            onBook={handleBookService}
            bookingServiceId={bookingServiceId}
            translations={{
              services: t.services,
              noServices: t.noServices,
              allPhotos: t.allPhotos,
              general: t.general,
              book: t.book,
              minute: t.minute,
              hour: t.hour,
              sum: t.sum,
            }}
          />
        </div>

        {/* Team section */}
        <TeamStrip employees={employees} locale={locale} translations={{ specialists: t.specialists }} />

        {/* Reviews section */}
        {reviews.length > 0 && (
          <div id="reviews" className="mt-8 scroll-mt-4">
            <ReviewsSection reviews={reviews} reviewStats={business.review_stats ?? null} locale={locale} translations={{ reviewsTitle: t.reviewsTitle, reviewCount: t.reviewCount, showAllReviews: t.showAllReviews, showFewerReviews: t.showFewerReviews, noReviews: t.noReviews, beTheFirst: t.beTheFirst }} />
          </div>
        )}

        {/* About section */}
        <div className="mt-8">
          <AboutSection business={business} locale={locale} translations={t} />
        </div>

        {/* Location map */}
        {business.location?.lat && business.location?.lng && (
          <div id="location" className="mt-8 scroll-mt-4">
            <h2 className="text-2xl font-semibold text-stone-900 mb-4">{t.location}</h2>
            <LocationMap
              lat={business.location.lat}
              lng={business.location.lng}
              businessName={business.name}
              address={geoAddress || business.location.address}
              directionsLabel={t.getDirections}
            />
          </div>
        )}

        {/* Working hours (inline for Instagram in-app browser) */}
        {isFromInstagram && business.working_hours && (
          <div className="mt-8">
            <h2 className="text-2xl font-semibold text-stone-900 mb-4">{t.workingHours}</h2>
            <DaySchedule workingHours={business.working_hours} dayNames={dayNames} closedLabel={t.closed} />
          </div>
        )}

        {/* Powered by BLYSS */}
        <a href="https://blyss.uz" target="_blank" rel="noopener noreferrer" className="mt-12 pb-2 flex items-center justify-center gap-2 text-stone-300 hover:text-stone-400 transition-colors">
          <span className="text-sm">powered by</span>
          <span className="text-xl font-bold tracking-wider">BLYSS</span>
        </a>
      </div>

      {/* Working Hours modal */}
      <AnimatePresence>
        {showHoursModal && business.working_hours && (
          <motion.div className="fixed inset-0 bg-black/50 flex items-end lg:items-center justify-center z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowHoursModal(false)}>
            <motion.div className="bg-white w-full lg:w-[420px] rounded-t-[28px] lg:rounded-2xl overflow-hidden" initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 30, stiffness: 300 }} onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-center pt-3 lg:hidden"><div className="w-10 h-1 bg-stone-300 rounded-full" /></div>
              <div className="px-6 pt-5 pb-2">
                <h3 className="text-2xl xl:text-3xl font-bold text-stone-900">{t.workingHours}</h3>
              </div>
              <div className="px-4 pb-6">
                <DaySchedule workingHours={business.working_hours} dayNames={dayNames} closedLabel={t.closed} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Location permission modal */}
      <AnimatePresence>
        {showLocationModal && (
          <motion.div className="fixed inset-0 bg-black/50 flex items-end lg:items-center justify-center z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowLocationModal(false)}>
            <motion.div className="bg-white w-full lg:w-[420px] rounded-t-[28px] lg:rounded-2xl overflow-hidden" initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 30, stiffness: 300 }} onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-center pt-3 lg:hidden"><div className="w-10 h-1 bg-stone-300 rounded-full" /></div>
              <div className="flex justify-center pt-5 pb-2"><div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center"><MapPin size={28} className="text-primary" /></div></div>
              <div className="px-6 pb-2 text-center"><h3 className="text-lg font-bold text-stone-900">{t.locationBlockedTitle}</h3><p className="text-sm text-stone-500 mt-2">{t.locationBlockedDesc}</p></div>
              <div className="px-6 py-4 space-y-3">
                {[t.locationStep1, t.locationStep2, t.locationStep3].map((step, i) => (
                  <div key={i} className="flex items-start gap-3"><div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5"><span className="text-xs font-bold text-primary">{i + 1}</span></div><p className="text-sm text-stone-700">{step}</p></div>
                ))}
              </div>
              <div className="px-6 pb-7 pt-2"><button onClick={() => setShowLocationModal(false)} className="w-full py-3.5 bg-primary text-white rounded-2xl font-semibold text-sm active:scale-[0.98] transition-transform">{t.gotIt}</button></div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Gallery Lightbox */}
      <GalleryLightbox photos={allPhotos} initialIndex={currentImageIndex} open={showGallery} onClose={() => setShowGallery(false)} translations={{ allPhotos: t.allPhotos, interior: t.interior, exterior: t.exterior }} />
    </div>

    {/* Chat Widget */}
    <ChatWidget
      businessId={businessId}
      businessName={typeof business.name === 'object' ? (business.name as any)[locale] || (business.name as any).ru || '' : business.name}
      locale={locale}
      primaryColor={primaryColor}
    />
 </div>
  );
}
