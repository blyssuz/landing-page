'use client';

import { useState, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, MapPin } from 'lucide-react';
import { setBookingIntent } from './actions';
import type { TenantPageProps, Service } from './_lib/types';
import type { Locale } from '@/lib/i18n';
import { UI_TEXT } from './_lib/translations';
import { isOpenNow, getClosingTime, formatPrice, formatDuration, getText } from './_lib/utils';
import { useDistance } from './_lib/use-distance';
import { useActiveSection } from './_lib/use-active-section';
import { HeroMosaic } from './_components/HeroGallery/HeroMosaic';
import { HeroCarousel } from './_components/HeroGallery/HeroCarousel';
import { HeroEmpty } from './_components/HeroGallery/HeroEmpty';
import { GalleryLightbox } from './_components/HeroGallery/GalleryLightbox';
import { BusinessHeader } from './_components/BusinessHeader';
import { LanguageSwitcher } from './_components/LanguageSwitcher';
import { TabNavigation } from './_components/TabNavigation';
import { TeamSection } from './_components/TeamSection';
import { ReviewsSection } from './_components/ReviewsSection';
import { DesktopSidebar } from './_components/DesktopSidebar';
import { AboutSection } from './_components/AboutSection';
import { BottomNav } from './_components/BottomNav';

export function TenantPage({ business, services, employees, photos, reviews, tenantSlug, businessId, locale, savedUser }: TenantPageProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { distance, distanceLoading, distanceDenied, geoAddress, fetchDistance, showLocationModal, setShowLocationModal } = useDistance(business, locale);

  const servicesRef = useRef<HTMLDivElement>(null);
  const teamRef = useRef<HTMLDivElement>(null);
  const reviewsRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const activeTab = useActiveSection({ services: servicesRef, team: teamRef, reviews: reviewsRef, about: aboutRef });

  const [showGallery, setShowGallery] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
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

  const filteredServices = services.filter((svc) => {
    if (!searchQuery) return true;
    return getText(svc.name, locale).toLowerCase().includes(searchQuery.toLowerCase()) || getText(svc.description, locale).toLowerCase().includes(searchQuery.toLowerCase());
  });
  const groupedServices = filteredServices.reduce<Record<string, Service[]>>((acc, svc) => { const cat = svc.category || 'general'; (acc[cat] ??= []).push(svc); return acc; }, {});
  const categories = Object.keys(groupedServices);
  const displayedServices = activeCategory ? { [activeCategory]: groupedServices[activeCategory] || [] } : groupedServices;
  const allPhotos = photos.map((p) => ({ url: p.url, category: p.category }));
  const metadataBadgesProps = { openStatus, closingTime, distance, distanceLoading, distanceDenied, onRequestDistance: () => fetchDistance(true), reviewStats: business.review_stats ?? null, translations: { openUntil: t.openUntil, closedNow: t.closedNow, distanceAway: t.distanceAway, showDistance: t.showDistance } };
  const openGallery = (i: number) => { setCurrentImageIndex(i); setShowGallery(true); };

  const tabs = [
    { id: 'services', label: t.services, ref: servicesRef as React.RefObject<HTMLElement | null> },
    ...(employees.length > 0 ? [{ id: 'team', label: t.specialists, ref: teamRef as React.RefObject<HTMLElement | null> }] : []),
    ...(reviews.length > 0 ? [{ id: 'reviews', label: t.reviewsTitle, ref: reviewsRef as React.RefObject<HTMLElement | null>, count: reviews.length }] : []),
    { id: 'about', label: t.about, ref: aboutRef as React.RefObject<HTMLElement | null> },
  ];

  return (
    <div className="min-h-screen bg-background" style={{ '--primary': primaryColor } as React.CSSProperties}>
      {/* Hero */}
      {hasPhotos ? (
        <div className="relative">
          <HeroMosaic photos={photos} businessName={business.name} onPhotoClick={openGallery} onSeeAll={() => openGallery(0)} totalPhotoCount={photos.length} />
          <HeroCarousel photos={photos} businessName={business.name} tagline={business.tagline} onPhotoClick={openGallery} totalPhotoCount={photos.length} onSeeAll={() => openGallery(0)} />
          <div className="absolute top-3 right-3 lg:top-4 lg:right-4 z-10" onClick={(e) => e.stopPropagation()}>
            <LanguageSwitcher locale={locale} onSwitch={switchLocale} className="shadow-sm" />
          </div>
        </div>
      ) : (
        <HeroEmpty business={business} />
      )}

      {!hasPhotos && <BusinessHeader business={business} hasPhotos={false} locale={locale} onSwitchLocale={switchLocale} metadataBadgesProps={metadataBadgesProps} />}

      <TabNavigation tabs={tabs} activeTab={activeTab} onTabClick={() => {}} />

      <div className="max-w-[1350px] mx-auto px-4 lg:px-6 pb-24 lg:pb-20">
        <div className="lg:grid lg:grid-cols-[1fr_380px] lg:gap-8">
          <div>
            {hasPhotos && <BusinessHeader business={business} hasPhotos locale={locale} onSwitchLocale={switchLocale} metadataBadgesProps={metadataBadgesProps} />}

            {/* Services section (kept inline -- Phase 3 scope) */}
            <div ref={servicesRef} className="scroll-mt-16">
              <div className={`pb-3 lg:pb-4 ${!hasPhotos ? 'pt-5 lg:pt-8' : 'pt-5 lg:pt-6'}`}>
                <h2 className="text-base lg:text-2xl font-bold text-stone-900">{t.services}<span className="text-xs lg:text-sm font-normal text-stone-400 ml-1.5 lg:ml-2">{services.length}</span></h2>
              </div>
              <div className="mb-3 lg:mb-5">
                <div className="relative">
                  <Search size={16} className="absolute left-3.5 lg:left-4 top-1/2 -translate-y-1/2 text-stone-300" />
                  <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder={t.searchServices} className="w-full pl-10 lg:pl-11 pr-10 py-2.5 lg:py-3 bg-stone-50 border border-transparent rounded-xl lg:rounded-2xl text-sm lg:text-base text-stone-900 placeholder:text-stone-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all duration-200" />
                  {searchQuery && <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-stone-200 rounded-full transition-colors"><X size={14} className="text-stone-400" /></button>}
                </div>
              </div>
              {categories.length > 1 && !searchQuery && (
                <div className="flex gap-1.5 lg:gap-2 overflow-x-auto scrollbar-hide pb-3 lg:pb-4 -mx-1 px-1">
                  <button onClick={() => setActiveCategory(null)} className={`flex-shrink-0 px-3 lg:px-4 py-1.5 lg:py-2 rounded-full text-xs lg:text-sm font-medium transition-all duration-200 ${activeCategory === null ? 'bg-primary text-white shadow-sm' : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-100'}`}>{t.allPhotos}</button>
                  {categories.map((cat) => (
                    <button key={cat} onClick={() => setActiveCategory(cat === activeCategory ? null : cat)} className={`flex-shrink-0 px-3 lg:px-4 py-1.5 lg:py-2 rounded-full text-xs lg:text-sm font-medium capitalize transition-all duration-200 ${activeCategory === cat ? 'bg-primary text-white shadow-sm' : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-100'}`}>{cat === 'general' ? t.general : cat}</button>
                  ))}
                </div>
              )}
              {Object.keys(displayedServices).length > 0 ? Object.entries(displayedServices).map(([category, categoryServices]) => (
                <div key={category} className="mb-4 lg:mb-6">
                  {categories.length > 1 && !activeCategory && <h3 className="text-sm lg:text-lg font-semibold text-stone-900 mb-2 lg:mb-3 capitalize">{category === 'general' ? t.general : category}</h3>}
                  <div className="bg-white rounded-xl lg:rounded-2xl border border-stone-100 overflow-hidden">
                    {categoryServices.map((service, idx) => (
                      <motion.div key={service.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.03, duration: 0.3 }} className={`flex items-center justify-between px-3.5 lg:px-5 py-3 lg:py-4 group hover:bg-stone-50/80 transition-colors duration-150 ${idx > 0 ? 'border-t border-stone-100' : ''}`}>
                        <div className="flex-1 min-w-0 pr-3 lg:pr-4">
                          <h4 className="text-[13px] lg:text-base font-semibold text-stone-900 line-clamp-1">{getText(service.name, locale)}</h4>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-[13px] lg:text-sm font-semibold text-stone-700">{formatPrice(service.price)} {t.sum}</span>
                            <span className="text-stone-300">&middot;</span>
                            <span className="text-xs lg:text-sm text-stone-400">{formatDuration(service.duration_minutes, t.minute, t.hour)}</span>
                          </div>
                          {service.description && getText(service.description, locale) && <p className="text-xs text-stone-400 mt-0.5 lg:mt-1 line-clamp-1 hidden lg:block">{getText(service.description, locale)}</p>}
                        </div>
                        <button onClick={() => handleBookService(service)} disabled={bookingServiceId === service.id} className="flex-shrink-0 px-4 lg:px-5 py-1.5 lg:py-2 rounded-full text-xs lg:text-sm font-semibold bg-primary/10 text-primary lg:bg-transparent lg:border-2 lg:border-primary hover:bg-primary hover:text-white transition-all duration-200 disabled:opacity-70 flex items-center gap-1.5">
                          {bookingServiceId === service.id && <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>}
                          {t.book}
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )) : (
                <div className="py-16 text-center"><Search size={32} className="mx-auto text-stone-200 mb-3" /><p className="text-stone-400 text-sm">{t.noServices}</p></div>
              )}
            </div>

            {employees.length > 0 && <div className="mt-6 lg:mt-10"><TeamSection ref={teamRef} employees={employees} locale={locale} translations={{ specialists: t.specialists, noTeam: t.noTeam }} /></div>}
            {reviews.length > 0 && <div className="mt-6 lg:mt-10"><ReviewsSection ref={reviewsRef} reviews={reviews} reviewStats={business.review_stats ?? null} locale={locale} translations={{ reviewsTitle: t.reviewsTitle, reviewCount: t.reviewCount, showAllReviews: t.showAllReviews, showFewerReviews: t.showFewerReviews, noReviews: t.noReviews, beTheFirst: t.beTheFirst }} /></div>}
          </div>

          <div ref={aboutRef}><DesktopSidebar business={business} locale={locale} savedUser={savedUser} geoAddress={geoAddress} basePath={basePath} translations={t} servicesRef={servicesRef as React.RefObject<HTMLElement | null>} /></div>
        </div>
        <div className="mt-6 lg:mt-0"><AboutSection ref={aboutRef} business={business} locale={locale} geoAddress={geoAddress} translations={t} /></div>
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

      <GalleryLightbox photos={allPhotos} initialIndex={currentImageIndex} open={showGallery} onClose={() => setShowGallery(false)} translations={{ allPhotos: t.allPhotos, interior: t.interior, exterior: t.exterior }} />
      <BottomNav locale={locale} business={business} basePath={basePath} translations={{ myBookings: t.myBookings, bookNow: t.bookNow, call: t.call }} />
    </div>
  );
}
