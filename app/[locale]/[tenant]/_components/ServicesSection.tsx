'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { springs } from '@/lib/animations';
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
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const groupedServices = services.reduce<Record<string, Service[]>>((acc, svc) => {
    const cat = svc.category || 'general';
    (acc[cat] ??= []).push(svc);
    return acc;
  }, {});
  const categories = Object.keys(groupedServices);
  const displayedServices = activeCategory
    ? { [activeCategory]: groupedServices[activeCategory] || [] }
    : groupedServices;

  const handleCategoryChange = (cat: string | null) => {
    setActiveCategory(cat);
    setExpandedId(null);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-stone-900 mb-4">{t.services}</h2>

      {/* Category pills */}
      {categories.length > 1 && (
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-4 -mx-1 px-1">
          <button
            onClick={() => handleCategoryChange(null)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
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
              onClick={() => handleCategoryChange(cat === activeCategory ? null : cat)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium capitalize transition-all duration-200 ${
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
              <h3 className="text-base font-medium text-stone-900 mb-2 capitalize">
                {category === 'general' ? t.general : category}
              </h3>
            )}
            <div>
              {categoryServices.map((service, idx) => {
                const description = getText(service.description, locale).trim();
                const isExpandable = description !== '';
                const isExpanded = expandedId === service.id;

                return (
                  <div key={service.id}>
                    <div
                      onClick={isExpandable ? () => setExpandedId(service.id === expandedId ? null : service.id) : undefined}
                      className={`flex items-center justify-between py-4 ${idx > 0 ? 'border-t border-stone-100' : ''} ${isExpandable ? 'cursor-pointer' : ''}`}
                    >
                      <div className="flex-1 min-w-0 pr-4">
                        <h4 className="text-base font-medium text-stone-900 line-clamp-1">
                          {getText(service.name, locale)}
                        </h4>
                        <p className="text-sm text-stone-500 mt-0.5">
                          {formatDuration(service.duration_minutes, t.minute, t.hour)}
                        </p>
                        <p className="text-sm font-medium text-stone-900 mt-0.5">
                          {formatPrice(service.price)} {t.sum}
                        </p>
                      </div>

                      {isExpandable ? (
                        <motion.div
                          animate={{ rotate: isExpanded ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                          className="flex-shrink-0"
                        >
                          <ChevronDown size={20} className="text-stone-400" />
                        </motion.div>
                      ) : (
                        <BookButton
                          label={t.book}
                          loading={bookingServiceId === service.id}
                          onClick={(e) => { e.stopPropagation(); onBook(service); }}
                        />
                      )}
                    </div>

                    {/* Expanded content */}
                    <AnimatePresence>
                      {isExpandable && isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={springs.gentle}
                          className="overflow-hidden"
                        >
                          <div className="pb-4">
                            <p className="text-sm text-stone-500 mb-3">{description}</p>
                            <BookButton
                              label={t.book}
                              loading={bookingServiceId === service.id}
                              onClick={(e) => { e.stopPropagation(); onBook(service); }}
                            />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
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
    </div>
  );
}

function BookButton({ label, loading, onClick }: { label: string; loading: boolean; onClick: (e: React.MouseEvent) => void }) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="flex-shrink-0 px-5 py-2 rounded-full text-sm font-medium border border-stone-200 text-stone-900 hover:bg-stone-50 transition-all duration-200 disabled:opacity-70 flex items-center gap-1.5"
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
