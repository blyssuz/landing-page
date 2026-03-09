'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin } from 'lucide-react';
import { setBookingIntent } from './actions';
import type { TenantPageProps, Service } from './_lib/types';
import type { Locale } from '@/lib/i18n';
import { UI_TEXT } from './_lib/translations';
import { isOpenNow, getClosingTime, formatPrice, formatDuration, getText } from './_lib/utils';
import { useDistance } from './_lib/use-distance';
import { GalleryLightbox } from './_components/HeroGallery/GalleryLightbox';
import { ProfileHeader } from './_components/ProfileHeader';
import { PhotoStrip } from './_components/PhotoStrip';
import { TeamSection } from './_components/TeamSection';
import { ReviewsSection } from './_components/ReviewsSection';
import { AboutSection } from './_components/AboutSection';

export function TenantPage({ business, services, employees, photos, reviews, tenantSlug, businessId, locale, savedUser }: TenantPageProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { distance, distanceLoading, distanceDenied, geoAddress, fetchDistance, showLocationModal, setShowLocationModal } = useDistance(business, locale);

  const [showGallery, setShowGallery] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [bookingServiceId, setBookingServiceId] = useState<string | null>(null);

  const primaryColor = business.primary_color || '#088395';
  const openStatus = isOpenNow(business.working_hours);
  const closingTime = getClosingTime(business.working_hours);
  const t = UI_TEXT[locale];
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

  const groupedServices = services.reduce<Record<string, Service[]>>((acc, svc) => {
    const cat = svc.category || 'general';
    (acc[cat] ??= []).push(svc);
    return acc;
  }, {});
  const categories = Object.keys(groupedServices);
  const displayedServices = activeCategory ? { [activeCategory]: groupedServices[activeCategory] || [] } : groupedServices;
  const allPhotos = photos.map((p) => ({ url: p.url, category: p.category }));
  const openGallery = (i: number) => { setCurrentImageIndex(i); setShowGallery(true); };

  return (
    <div className="min-h-screen bg-white" style={{ '--primary': primaryColor } as React.CSSProperties}>
      {/* Profile Header */}
      <ProfileHeader
        business={business}
        locale={locale}
        onSwitchLocale={switchLocale}
        onBook={() => router.push(`${basePath}/booking`)}
        openStatus={openStatus}
        closingTime={closingTime}
        distance={distance}
        distanceLoading={distanceLoading}
        translations={t}
      />

      {/* Photo Strip */}
      {hasPhotos && <PhotoStrip photos={photos} onPhotoClick={openGallery} />}

      {/* Main Content -- single column, no sidebar */}
      <div className="px-4 pb-24">
        {/* Services section */}
        <div className="pt-6">
          <h2 className="text-xl font-semibold text-stone-900 mb-4">{t.services}</h2>

          {/* Category pills */}
          {categories.length > 1 && (
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-4 -mx-1 px-1">
              <button onClick={() => setActiveCategory(null)} className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${activeCategory === null ? 'bg-stone-900 text-white' : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'}`}>{t.allPhotos}</button>
              {categories.map((cat) => (
                <button key={cat} onClick={() => setActiveCategory(cat === activeCategory ? null : cat)} className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium capitalize transition-all duration-200 ${activeCategory === cat ? 'bg-stone-900 text-white' : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'}`}>{cat === 'general' ? t.general : cat}</button>
              ))}
            </div>
          )}

          {/* Service rows */}
          {Object.keys(displayedServices).length > 0 ? Object.entries(displayedServices).map(([category, categoryServices]) => (
            <div key={category} className="mb-2">
              {categories.length > 1 && !activeCategory && <h3 className="text-base font-medium text-stone-900 mb-2 capitalize">{category === 'general' ? t.general : category}</h3>}
              <div>
                {categoryServices.map((service, idx) => (
                  <motion.div key={service.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.03, duration: 0.3 }} className={`flex items-center justify-between py-4 ${idx > 0 ? 'border-t border-stone-100' : ''}`}>
                    <div className="flex-1 min-w-0 pr-4">
                      <h4 className="text-base font-medium text-stone-900 line-clamp-1">{getText(service.name, locale)}</h4>
                      <p className="text-sm text-stone-500 mt-0.5">{formatDuration(service.duration_minutes, t.minute, t.hour)}</p>
                      <p className="text-sm font-medium text-stone-900 mt-0.5">{formatPrice(service.price)} {t.sum}</p>
                    </div>
                    <button onClick={() => handleBookService(service)} disabled={bookingServiceId === service.id} className="flex-shrink-0 px-5 py-2 rounded-full text-sm font-medium border border-stone-200 text-stone-900 hover:bg-stone-50 transition-all duration-200 disabled:opacity-70 flex items-center gap-1.5">
                      {bookingServiceId === service.id && <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>}
                      {t.book}
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>
          )) : (
            <div className="py-16 text-center"><p className="text-stone-400 text-sm">{t.noServices}</p></div>
          )}
        </div>

        {/* Team section */}
        {employees.length > 0 && (
          <div className="mt-8">
            <TeamSection employees={employees} locale={locale} translations={{ specialists: t.specialists, noTeam: t.noTeam }} />
          </div>
        )}

        {/* Reviews section */}
        {reviews.length > 0 && (
          <div className="mt-8">
            <ReviewsSection reviews={reviews} reviewStats={business.review_stats ?? null} locale={locale} translations={{ reviewsTitle: t.reviewsTitle, reviewCount: t.reviewCount, showAllReviews: t.showAllReviews, showFewerReviews: t.showFewerReviews, noReviews: t.noReviews, beTheFirst: t.beTheFirst }} />
          </div>
        )}

        {/* About section */}
        <div className="mt-8">
          <AboutSection business={business} locale={locale} geoAddress={geoAddress} translations={t} />
        </div>
      </div>

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
  );
}
