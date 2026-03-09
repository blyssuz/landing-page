'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Clock } from 'lucide-react';
import type { Service, Locale } from '../_lib/types';
import { getText, formatPrice, formatDuration } from '../_lib/utils';

interface ServicesSectionProps {
  services: Service[];
  locale: Locale;
  onBook: (service: Service) => void;
  bookingServiceId: string | null;
  translations: {
    services: string;
    noServices: string;
    allPhotos: string;
    general: string;
    book: string;
    minute: string;
    hour: string;
    sum: string;
  };
}

export function ServicesSection({ services, locale, onBook, bookingServiceId, translations: t }: ServicesSectionProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [detailService, setDetailService] = useState<Service | null>(null);

  const groupedServices = services.reduce<Record<string, Service[]>>((acc, svc) => {
    const cat = svc.category || 'general';
    (acc[cat] ??= []).push(svc);
    return acc;
  }, {});
  const categories = Object.keys(groupedServices);
  const displayedServices = activeCategory
    ? { [activeCategory]: groupedServices[activeCategory] || [] }
    : groupedServices;

  return (
    <div>
      <h2 className="text-2xl font-bold text-stone-900 mb-4">{t.services}</h2>

      {/* Category pills */}
      {categories.length > 1 && (
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-4 -mx-1 px-1">
          <button
            onClick={() => setActiveCategory(null)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-base font-medium transition-all duration-200 ${
              activeCategory === null
                ? 'bg-stone-900 text-white'
                : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
            }`}
          >
            {t.allPhotos}
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat === activeCategory ? null : cat)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-base font-medium capitalize transition-all duration-200 ${
                activeCategory === cat
                  ? 'bg-stone-900 text-white'
                  : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
              }`}
            >
              {cat === 'general' ? t.general : cat}
            </button>
          ))}
        </div>
      )}

      {/* Service rows */}
      {Object.keys(displayedServices).length > 0 ? (
        Object.entries(displayedServices).map(([category, categoryServices]) => (
          <div key={category} className="mb-2">
            {categories.length > 1 && !activeCategory && (
              <h3 className="text-lg font-medium text-stone-900 mb-2 capitalize">
                {category === 'general' ? t.general : category}
              </h3>
            )}
            <div>
              {categoryServices.map((service, idx) => {
                const description = getText(service.description, locale).trim();
                const hasDescription = description !== '';

                return (
                  <div
                    key={service.id}
                    onClick={hasDescription ? () => setDetailService(service) : undefined}
                    className={`flex items-center justify-between py-4 ${idx > 0 ? 'border-t border-stone-100' : ''} ${hasDescription ? 'cursor-pointer' : ''}`}
                  >
                    <div className="flex-1 min-w-0 pr-4">
                      <h4 className="text-lg font-semibold text-stone-900 line-clamp-1">
                        {getText(service.name, locale)}
                      </h4>
                      <p className="text-base text-stone-500 mt-0.5">
                        {formatDuration(service.duration_minutes, t.minute, t.hour)}
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                      <p className="text-base xl:text-lg font-semibold text-stone-900">
                        {formatPrice(service.price)} {t.sum}
                      </p>
                      <BookButton
                        label={t.book}
                        loading={bookingServiceId === service.id}
                        onClick={(e) => { e.stopPropagation(); onBook(service); }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))
      ) : (
        <div className="py-16 text-center">
          <p className="text-stone-400 text-sm">{t.noServices}</p>
        </div>
      )}

      {/* Service detail modal */}
      <AnimatePresence>
        {detailService && (
          <ServiceDetailModal
            service={detailService}
            locale={locale}
            bookingLoading={bookingServiceId === detailService.id}
            onBook={() => onBook(detailService)}
            onClose={() => setDetailService(null)}
            translations={t}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function ServiceDetailModal({
  service,
  locale,
  bookingLoading,
  onBook,
  onClose,
  translations: t,
}: {
  service: Service;
  locale: Locale;
  bookingLoading: boolean;
  onBook: () => void;
  onClose: () => void;
  translations: ServicesSectionProps['translations'];
}) {
  const description = getText(service.description, locale).trim();

  return (
    <>
      {/* Backdrop */}
      <motion.div
        className="fixed inset-0 bg-black/50 z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      {/* Bottom sheet */}
      <motion.div
        className="fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-[28px] max-h-[80vh] overflow-y-auto lg:inset-auto lg:top-1/2 lg:left-1/2 lg:max-w-md lg:w-[calc(100%-2rem)] lg:rounded-2xl lg:max-h-[90vh]"
        style={{ transform: 'none' }}
        initial={{ y: '100%', opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: '100%', opacity: 0 }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle (mobile) */}
        <div className="flex justify-center pt-3 lg:hidden">
          <div className="w-10 h-1 bg-stone-300 rounded-full" />
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-stone-100 hover:bg-stone-200 transition-colors"
        >
          <X size={16} className="text-stone-600" />
        </button>

        <div className="px-6 pt-5 pb-6">
          {/* Service name */}
          <h3 className="text-xl font-semibold text-stone-900 pr-8">
            {getText(service.name, locale)}
          </h3>

          {/* Duration & price */}
          <div className="flex items-center gap-3 mt-2">
            <span className="flex items-center gap-1 text-base text-stone-500">
              <Clock size={16} />
              {formatDuration(service.duration_minutes, t.minute, t.hour)}
            </span>
            <span className="text-base font-medium text-stone-900">
              {formatPrice(service.price)} {t.sum}
            </span>
          </div>

          {/* Description */}
          {description && (
            <p className="text-base text-stone-600 leading-relaxed mt-4">
              {description}
            </p>
          )}

          {/* Book button */}
          <button
            onClick={onBook}
            disabled={bookingLoading}
            className="w-full mt-6 py-3.5 bg-stone-900 text-white rounded-2xl font-semibold text-base active:scale-[0.98] transition-transform disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {bookingLoading && (
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            )}
            {t.book}
          </button>
        </div>
      </motion.div>
    </>
  );
}

function BookButton({ label, loading, onClick }: { label: string; loading: boolean; onClick: (e: React.MouseEvent) => void }) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="flex-shrink-0 px-5 py-2 rounded-full text-base font-medium bg-[var(--primary)] text-white hover:opacity-90 transition-all duration-200 disabled:opacity-70 flex items-center gap-1.5"
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {label}
    </button>
  );
}
