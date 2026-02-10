'use client';

import { useState, useRef } from 'react';
import {
  Clock,
  MapPin,
  Phone,
  Check,
  Globe,
  Star,
  Instagram,
  Share2,
  Heart,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

type Language = 'uz' | 'ru';

interface MultilingualText {
  uz: string;
  ru: string;
}

interface Service {
  id: string;
  name: MultilingualText;
  description?: MultilingualText | null;
  price: number;
  duration_minutes: number;
  category?: string;
}

interface Business {
  name: string;
  business_type: string;
  location?: {
    lat?: number;
    lng?: number;
    address?: string;
  };
  working_hours?: Record<string, { start: number; end: number; is_open: boolean }>;
  business_phone_number: string;
  tenant_url: string;
  avatar_url?: string | null;
  gallery_images?: string[];
  rating?: number;
  reviews_count?: number;
  social_media?: {
    instagram?: string;
  };
  tagline?: string;
}

interface TenantPageProps {
  business: Business;
  services: Service[];
}

// Fresha brand colors
const COLORS = {
  primary: '#0D1619',    // Bunker - deep dark for text/headers
  accent: '#037AFF',     // Azure Radiance - blue for CTAs
  green: '#1DB954',      // Green - status indicators
  white: '#FFFFFF',
  bg: '#F7F7F7',
};

function secondsToTime(seconds: number): string {
  if (seconds >= 86399) return '24:00';
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

const DAY_NAMES: Record<Language, Record<string, string>> = {
  uz: {
    monday: 'Dushanba',
    tuesday: 'Seshanba',
    wednesday: 'Chorshanba',
    thursday: 'Payshanba',
    friday: 'Juma',
    saturday: 'Shanba',
    sunday: 'Yakshanba',
  },
  ru: {
    monday: 'Понедельник',
    tuesday: 'Вторник',
    wednesday: 'Среда',
    thursday: 'Четверг',
    friday: 'Пятница',
    saturday: 'Суббота',
    sunday: 'Воскресенье',
  },
};

const DAY_ORDER = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

const UI_TEXT: Record<Language, Record<string, string>> = {
  uz: {
    openUntil: '{{time}} gacha ochiq',
    closedNow: 'Hozir yopiq',
    call: "Qo'ng'iroq qilish",
    location: 'Manzil',
    workingHours: 'Ish vaqti',
    closed: 'Yopiq',
    services: 'Xizmatlar',
    noServices: 'Xizmatlar mavjud emas',
    comingSoon: "Tez orada buyurtma berish funksiyasi mavjud bo'ladi",
    contact: "Bog'lanish",
    cancel: 'Bekor qilish',
    minute: 'daq',
    hour: 'soat',
    sum: "so'm",
    reviews: 'sharhlar',
    today: 'Bugun',
    seeAllImages: "Barcha suratlarni ko'rish",
    searchServices: 'Xizmatlarni qidirish...',
    book: 'Band qilish',
    about: 'Haqida',
    getDirections: "Yo'nalish olish",
    added: "Qo'shildi",
    continue: 'Davom etish',
    bookNow: 'Band qilish',
    selected: 'xizmat tanlangan',
    total: 'Jami',
    general: 'Umumiy',
    photos: 'Suratlar',
    seeAll: "Hammasini ko'rish",
    amenities: 'Qulayliklar',
    parking: "Avtoturargoh mavjud",
  },
  ru: {
    openUntil: 'Открыто до {{time}}',
    closedNow: 'Сейчас закрыто',
    call: 'Позвонить',
    location: 'Адрес',
    workingHours: 'Время работы',
    closed: 'Закрыто',
    services: 'Услуги',
    noServices: 'Услуги отсутствуют',
    comingSoon: 'Функция бронирования скоро будет доступна',
    contact: 'Связаться',
    cancel: 'Отмена',
    minute: 'мин',
    hour: 'ч',
    sum: 'сум',
    reviews: 'отзывов',
    today: 'Сегодня',
    seeAllImages: 'Посмотреть все фото',
    searchServices: 'Поиск услуг...',
    book: 'Забронировать',
    about: 'О салоне',
    getDirections: 'Маршрут',
    added: 'Добавлено',
    continue: 'Продолжить',
    bookNow: 'Забронировать',
    selected: 'услуг выбрано',
    total: 'Итого',
    general: 'Общие',
    photos: 'Фото',
    seeAll: 'Смотреть все',
    amenities: 'Удобства',
    parking: 'Парковка доступна',
  },
};

const PLACEHOLDER_GALLERY = [
  'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1559599101-f09722fb4948?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1600948836101-f9ffda59d250?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=400&h=300&fit=crop',
];

export function TenantPage({ business, services }: TenantPageProps) {
  const [selectedServices, setSelectedServices] = useState<Service[]>([]);
  const [showBooking, setShowBooking] = useState(false);
  const [language, setLanguage] = useState<Language>('uz');
  const [searchQuery, setSearchQuery] = useState('');
  const [showGallery, setShowGallery] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState('services');
  const [showAllHours, setShowAllHours] = useState(false);

  const servicesRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);

  const t = UI_TEXT[language];
  const dayNames = DAY_NAMES[language];
  const galleryImages = business.gallery_images?.length ? business.gallery_images : PLACEHOLDER_GALLERY;

  const getText = (text: MultilingualText | string | null | undefined): string => {
    if (!text) return '';
    if (typeof text === 'string') return text;
    return text[language] || text.uz || '';
  };

  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes} ${t.minute}`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours} ${t.hour} ${mins} ${t.minute}` : `${hours} ${t.hour}`;
  };

  const toggleLanguage = () => setLanguage(prev => prev === 'uz' ? 'ru' : 'uz');

  const getTodayName = () => {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    return days[new Date().getDay()];
  };

  const isOpenNow = () => {
    const todayName = getTodayName();
    const now = new Date();
    const currentSeconds = now.getHours() * 3600 + now.getMinutes() * 60;
    const todayHours = business.working_hours?.[todayName];
    if (!todayHours || !todayHours.is_open) return false;
    return currentSeconds >= todayHours.start && currentSeconds <= todayHours.end;
  };

  const getClosingTime = () => {
    const todayName = getTodayName();
    const todayHours = business.working_hours?.[todayName];
    if (!todayHours || !todayHours.is_open) return null;
    return secondsToTime(todayHours.end);
  };

  const handleServiceToggle = (service: Service) => {
    setSelectedServices(prev => {
      const exists = prev.find(s => s.id === service.id);
      if (exists) return prev.filter(s => s.id !== service.id);
      return [...prev, service];
    });
  };

  const filteredServices = services.filter(service => {
    if (!searchQuery) return true;
    const name = getText(service.name).toLowerCase();
    const desc = getText(service.description).toLowerCase();
    return name.includes(searchQuery.toLowerCase()) || desc.includes(searchQuery.toLowerCase());
  });

  const groupedServices = filteredServices.reduce<Record<string, Service[]>>((acc, service) => {
    const cat = service.category || 'general';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(service);
    return acc;
  }, {});

  const totalPrice = selectedServices.reduce((sum, s) => sum + s.price, 0);
  const totalDuration = selectedServices.reduce((sum, s) => sum + s.duration_minutes, 0);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: business.name,
          text: business.tagline || business.business_type,
          url: window.location.href,
        });
      } catch {
        // User cancelled
      }
    }
  };

  const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length);
  const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);

  const scrollToSection = (section: string) => {
    setActiveTab(section);
    const ref = section === 'services' ? servicesRef : aboutRef;
    const offset = 52; // tab bar height
    const el = ref.current;
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  const openStatus = isOpenNow();
  const closingTime = getClosingTime();

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>

      {/* ===== GALLERY MOSAIC ===== */}
      <div className="relative">
        {/* Mobile: Single image carousel */}
        <div className="lg:hidden relative aspect-[4/3] bg-gray-100">
          <img
            src={galleryImages[currentImageIndex]}
            alt={business.name}
            className="w-full h-full object-cover"
          />
          {/* Mobile nav dots */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {galleryImages.slice(0, 5).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentImageIndex(idx)}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  idx === currentImageIndex ? 'bg-white w-4' : 'bg-white/60'
                }`}
              />
            ))}
          </div>
          {/* Mobile swipe arrows */}
          <button onClick={prevImage} className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center">
            <ChevronLeft size={18} className="text-[#0D1619]" />
          </button>
          <button onClick={nextImage} className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center">
            <ChevronRight size={18} className="text-[#0D1619]" />
          </button>
          {/* Top actions mobile */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-[#0D1619]"
            >
              <Globe size={12} />
              {language === 'uz' ? 'RU' : 'UZ'}
            </button>
            <div className="flex items-center gap-1.5">
              <button onClick={handleShare} className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center">
                <Share2 size={14} className="text-[#0D1619]" />
              </button>
              <button onClick={() => setIsFavorite(!isFavorite)} className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center">
                <Heart size={14} className={isFavorite ? 'text-red-500 fill-red-500' : 'text-[#0D1619]'} />
              </button>
            </div>
          </div>
        </div>

        {/* Desktop: Mosaic grid */}
        <div className="hidden lg:block max-w-[1200px] mx-auto px-6 pt-4">
          <div className="grid grid-cols-4 grid-rows-2 gap-2 h-[400px] rounded-xl overflow-hidden">
            {/* Large main image */}
            <div className="col-span-2 row-span-2 relative cursor-pointer group" onClick={() => { setCurrentImageIndex(0); setShowGallery(true); }}>
              <img src={galleryImages[0]} alt={business.name} className="w-full h-full object-cover group-hover:brightness-95 transition-all" />
            </div>
            {/* Smaller images */}
            {galleryImages.slice(1, 5).map((img, idx) => (
              <div key={idx} className="relative cursor-pointer group overflow-hidden" onClick={() => { setCurrentImageIndex(idx + 1); setShowGallery(true); }}>
                <img src={img} alt="" className="w-full h-full object-cover group-hover:brightness-95 transition-all" />
                {idx === 3 && galleryImages.length > 5 && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center hover:bg-black/50 transition-colors">
                    <span className="text-white font-medium text-sm">{t.seeAllImages}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
          {/* Desktop top actions */}
          <div className="absolute top-8 right-10 flex items-center gap-2">
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-3 py-2 bg-white rounded-lg text-sm font-medium text-[#0D1619] shadow-sm hover:shadow transition-all border border-gray-200"
            >
              <Globe size={14} />
              {language === 'uz' ? 'RU' : 'UZ'}
            </button>
            <button onClick={handleShare} className="w-9 h-9 bg-white rounded-lg flex items-center justify-center shadow-sm hover:shadow transition-all border border-gray-200">
              <Share2 size={16} className="text-[#0D1619]" />
            </button>
            <button onClick={() => setIsFavorite(!isFavorite)} className="w-9 h-9 bg-white rounded-lg flex items-center justify-center shadow-sm hover:shadow transition-all border border-gray-200">
              <Heart size={16} className={isFavorite ? 'text-red-500 fill-red-500' : 'text-[#0D1619]'} />
            </button>
          </div>
        </div>
      </div>

      {/* ===== BUSINESS INFO HEADER ===== */}
      <div className="max-w-[1200px] mx-auto px-4 lg:px-6">
        <div className="py-5 lg:py-6">
          <h1 className="text-[22px] lg:text-[28px] font-bold text-[#0D1619] leading-tight">
            {business.name}
          </h1>

          <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5 mt-2.5">
            {/* Rating */}
            <div className="flex items-center gap-1">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} size={14} className="text-amber-400 fill-amber-400" />
                ))}
              </div>
              <span className="font-bold text-[#0D1619] text-sm">{business.rating || '5.0'}</span>
              <span className="text-sm text-gray-500">({business.reviews_count || 248})</span>
            </div>

            <span className="text-gray-300 text-sm">·</span>

            {/* Open/Closed */}
            {openStatus && closingTime ? (
              <span className="text-sm font-medium" style={{ color: COLORS.green }}>
                {t.openUntil.replace('{{time}}', closingTime)}
              </span>
            ) : (
              <span className="text-sm text-gray-500">{t.closedNow}</span>
            )}

            <span className="text-gray-300 text-sm">·</span>

            {/* Location */}
            {business.location?.address && (
              <span className="text-sm text-gray-500">{business.location.address}</span>
            )}
          </div>
        </div>
      </div>

      {/* ===== STICKY TAB NAVIGATION ===== */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-200">
        <div className="max-w-[1200px] mx-auto px-4 lg:px-6">
          <nav className="flex gap-6 lg:gap-8">
            {[
              { id: 'services', label: t.services },
              { id: 'about', label: t.about },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => scrollToSection(tab.id)}
                className={`relative py-3 text-[14px] font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-[#0D1619]'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#0D1619]" />
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* ===== MAIN CONTENT ===== */}
      <div className="max-w-[1200px] mx-auto px-4 lg:px-6 pb-8">
        <div className="lg:flex lg:gap-10 pt-6">

          {/* ===== LEFT: SERVICES ===== */}
          <div className="flex-1 min-w-0" ref={servicesRef}>

            {/* Search */}
            <div className="mb-5">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t.searchServices}
                  className="w-full pl-10 pr-10 py-2.5 bg-[#F7F7F7] border border-transparent rounded-lg text-[14px] placeholder:text-gray-400 focus:outline-none focus:bg-white focus:border-gray-300 transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 hover:bg-gray-200 rounded"
                  >
                    <X size={14} className="text-gray-400" />
                  </button>
                )}
              </div>
            </div>

            {/* Service Categories & Items */}
            {Object.keys(groupedServices).length > 0 ? (
              Object.entries(groupedServices).map(([category, categoryServices]) => (
                <div key={category} className="mb-6">
                  {/* Category header */}
                  {(Object.keys(groupedServices).length > 1 || category !== 'general') && (
                    <h3 className="text-[16px] font-bold text-[#0D1619] mb-1 mt-2">
                      {category === 'general' ? t.general : category}
                    </h3>
                  )}

                  {/* Service list */}
                  <div>
                    {categoryServices.map((service) => {
                      const isSelected = selectedServices.some(s => s.id === service.id);
                      return (
                        <div
                          key={service.id}
                          className="flex items-start justify-between py-4 border-b border-gray-100 last:border-b-0"
                        >
                          {/* Left: name, description, duration */}
                          <div className="flex-1 min-w-0 pr-4">
                            <h4 className="text-[14px] font-medium text-[#0D1619]">
                              {getText(service.name)}
                            </h4>
                            {service.description && getText(service.description) && (
                              <p className="text-[13px] text-gray-500 mt-0.5 line-clamp-2">
                                {getText(service.description)}
                              </p>
                            )}
                            <p className="text-[13px] text-gray-400 mt-1">
                              {formatDuration(service.duration_minutes)}
                            </p>
                          </div>

                          {/* Right: price + book button */}
                          <div className="text-right flex-shrink-0 flex flex-col items-end">
                            <p className="text-[14px] font-medium text-[#0D1619]">
                              {formatPrice(service.price)} {t.sum}
                            </p>
                            <button
                              onClick={() => handleServiceToggle(service)}
                              className={`mt-2 px-4 py-1.5 text-[13px] font-medium rounded-md transition-all ${
                                isSelected
                                  ? 'text-white'
                                  : 'text-white hover:opacity-90'
                              }`}
                              style={{
                                backgroundColor: isSelected ? COLORS.primary : COLORS.accent,
                              }}
                            >
                              {isSelected ? (
                                <span className="flex items-center gap-1">
                                  <Check size={13} strokeWidth={2.5} />
                                  {t.added}
                                </span>
                              ) : (
                                t.book
                              )}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))
            ) : (
              <div className="py-12 text-center">
                <p className="text-gray-400 text-[14px]">{t.noServices}</p>
              </div>
            )}
          </div>

          {/* ===== RIGHT: SIDEBAR (Desktop) ===== */}
          <div className="hidden lg:block w-[340px] flex-shrink-0" ref={aboutRef}>
            <div className="sticky top-[52px] space-y-5 pt-0">

              {/* Map */}
              <div className="rounded-xl overflow-hidden border border-gray-200">
                <div className="aspect-[4/3] bg-gray-100 relative">
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
                      <MapPin size={28} className="text-gray-300" />
                    </div>
                  )}
                </div>
                <div className="p-3.5">
                  <p className="text-[13px] font-medium text-[#0D1619]">{business.name}</p>
                  {business.location?.address && (
                    <p className="text-[12px] text-gray-500 mt-0.5">{business.location.address}</p>
                  )}
                  {business.location?.lat && business.location?.lng && (
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${business.location.lat},${business.location.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block text-[12px] font-medium mt-1.5 hover:underline"
                      style={{ color: COLORS.accent }}
                    >
                      {t.getDirections}
                    </a>
                  )}
                </div>
              </div>

              {/* Working Hours */}
              <div className="rounded-xl border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-[13px] font-semibold text-[#0D1619]">{t.workingHours}</h4>
                  {openStatus && closingTime && (
                    <span className="text-[12px] font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: `${COLORS.green}15`, color: COLORS.green }}>
                      {t.openUntil.replace('{{time}}', closingTime)}
                    </span>
                  )}
                </div>
                {business.working_hours && (
                  <div className="space-y-2">
                    {DAY_ORDER.map((day) => {
                      const hours = business.working_hours?.[day];
                      const isToday = day === getTodayName();
                      return (
                        <div key={day} className={`flex justify-between text-[13px] ${isToday ? 'font-semibold' : ''}`}>
                          <span className={hours?.is_open ? 'text-[#0D1619]' : 'text-gray-400'}>
                            {dayNames[day]}
                          </span>
                          <span className={hours?.is_open ? 'text-[#0D1619]' : 'text-gray-400'}>
                            {hours?.is_open
                              ? `${secondsToTime(hours.start)} - ${secondsToTime(hours.end)}`
                              : t.closed}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Contact */}
              <div className="rounded-xl border border-gray-200 p-4">
                <h4 className="text-[13px] font-semibold text-[#0D1619] mb-3">{t.contact}</h4>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Phone size={15} className="text-gray-400" />
                    <span className="text-[13px] text-gray-600">{business.business_phone_number}</span>
                  </div>
                  <a
                    href={`tel:${business.business_phone_number}`}
                    className="text-[12px] font-medium hover:underline"
                    style={{ color: COLORS.accent }}
                  >
                    {t.call}
                  </a>
                </div>
                {business.social_media?.instagram && (
                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
                    <Instagram size={15} className="text-gray-400" />
                    <a
                      href={`https://instagram.com/${business.social_media.instagram}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[13px] hover:underline"
                      style={{ color: COLORS.accent }}
                    >
                      @{business.social_media.instagram}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ===== MOBILE: ABOUT SECTION ===== */}
        <div className="lg:hidden mt-8 space-y-4" ref={aboutRef}>
          {/* Map */}
          <div className="rounded-xl overflow-hidden border border-gray-200">
            <div className="aspect-[2/1] bg-gray-100">
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
                  <MapPin size={28} className="text-gray-300" />
                </div>
              )}
            </div>
            <div className="p-3.5">
              <p className="text-[14px] font-medium text-[#0D1619]">{business.name}</p>
              {business.location?.address && (
                <p className="text-[13px] text-gray-500 mt-0.5">{business.location.address}</p>
              )}
              {business.location?.lat && business.location?.lng && (
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${business.location.lat},${business.location.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-[13px] font-medium mt-1.5 hover:underline"
                  style={{ color: COLORS.accent }}
                >
                  {t.getDirections}
                </a>
              )}
            </div>
          </div>

          {/* Call button */}
          <a
            href={`tel:${business.business_phone_number}`}
            className="flex items-center justify-center gap-2 w-full py-3 text-white rounded-lg font-medium text-[14px]"
            style={{ backgroundColor: COLORS.accent }}
          >
            <Phone size={16} />
            {t.call} {business.business_phone_number}
          </a>

          {/* Hours - collapsible */}
          <div className="rounded-xl border border-gray-200 overflow-hidden">
            <button
              onClick={() => setShowAllHours(!showAllHours)}
              className="w-full flex items-center justify-between p-4"
            >
              <div className="flex items-center gap-2">
                <Clock size={15} className="text-gray-400" />
                <span className="text-[14px] font-medium text-[#0D1619]">{t.workingHours}</span>
              </div>
              <div className="flex items-center gap-2">
                {openStatus && (
                  <span className="text-[12px] font-medium" style={{ color: COLORS.green }}>
                    {t.openUntil.replace('{{time}}', closingTime || '')}
                  </span>
                )}
                {showAllHours ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
              </div>
            </button>
            {showAllHours && business.working_hours && (
              <div className="px-4 pb-4 space-y-2">
                {DAY_ORDER.map((day) => {
                  const hours = business.working_hours?.[day];
                  const isToday = day === getTodayName();
                  return (
                    <div key={day} className={`flex justify-between text-[13px] ${isToday ? 'font-semibold' : ''}`}>
                      <span className={hours?.is_open ? 'text-[#0D1619]' : 'text-gray-400'}>
                        {dayNames[day]}
                      </span>
                      <span className={hours?.is_open ? 'text-[#0D1619]' : 'text-gray-400'}>
                        {hours?.is_open
                          ? `${secondsToTime(hours.start)} - ${secondsToTime(hours.end)}`
                          : t.closed}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Instagram */}
          {business.social_media?.instagram && (
            <a
              href={`https://instagram.com/${business.social_media.instagram}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 px-4 py-3 border border-gray-200 rounded-xl"
            >
              <Instagram size={18} className="text-gray-500" />
              <span className="text-[13px] text-gray-600">@{business.social_media.instagram}</span>
            </a>
          )}
        </div>
      </div>

      {/* ===== STICKY BOTTOM BAR ===== */}
      {selectedServices.length > 0 && (
        <>
          {/* Mobile */}
          <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 z-40 safe-area-bottom">
            <button
              onClick={() => setShowBooking(true)}
              className="w-full py-3.5 text-white rounded-lg font-semibold text-[14px] active:scale-[0.98] transition-transform"
              style={{ backgroundColor: COLORS.accent }}
            >
              {t.bookNow} · {selectedServices.length} {t.selected} · {formatPrice(totalPrice)} {t.sum}
            </button>
          </div>

          {/* Desktop */}
          <div className="hidden lg:block fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
            <div className="max-w-[1200px] mx-auto px-6 py-3 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-[13px] text-gray-500">
                    {selectedServices.length} {t.selected}
                  </p>
                  <p className="text-[16px] font-bold text-[#0D1619]">
                    {formatPrice(totalPrice)} {t.sum}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowBooking(true)}
                className="px-8 py-3 text-white rounded-lg font-semibold text-[14px] hover:opacity-90 transition-opacity"
                style={{ backgroundColor: COLORS.accent }}
              >
                {t.bookNow}
              </button>
            </div>
          </div>
        </>
      )}

      {/* ===== BOOKING MODAL ===== */}
      {showBooking && (
        <div
          className="fixed inset-0 bg-black/50 flex items-end lg:items-center justify-center z-50"
          onClick={() => setShowBooking(false)}
        >
          <div
            className="bg-white w-full lg:w-[440px] lg:rounded-xl rounded-t-2xl max-h-[85vh] overflow-hidden animate-slideUp"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-100 px-5 py-3.5 flex items-center justify-between">
              <h3 className="text-[16px] font-bold text-[#0D1619]">{t.bookNow}</h3>
              <button
                onClick={() => setShowBooking(false)}
                className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100"
              >
                <X size={18} className="text-gray-500" />
              </button>
            </div>

            <div className="p-5 max-h-[50vh] overflow-y-auto">
              <div className="space-y-2.5">
                {selectedServices.map((service) => (
                  <div key={service.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                    <div>
                      <p className="text-[14px] font-medium text-[#0D1619]">{getText(service.name)}</p>
                      <p className="text-[12px] text-gray-400 mt-0.5">{formatDuration(service.duration_minutes)}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="text-[14px] font-medium text-[#0D1619]">{formatPrice(service.price)} {t.sum}</p>
                      <button
                        onClick={() => handleServiceToggle(service)}
                        className="text-gray-400 hover:text-red-400 transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-3 border-t border-gray-200 flex items-center justify-between">
                <span className="text-[13px] text-gray-500">{t.total} · {formatDuration(totalDuration)}</span>
                <span className="text-[18px] font-bold text-[#0D1619]">{formatPrice(totalPrice)} {t.sum}</span>
              </div>

              <div className="mt-5 p-3 bg-amber-50 rounded-lg">
                <p className="text-[13px] text-amber-700 text-center">{t.comingSoon}</p>
              </div>
            </div>

            <div className="p-5 border-t border-gray-100 space-y-2.5">
              <a
                href={`tel:${business.business_phone_number}`}
                className="flex items-center justify-center gap-2 w-full py-3.5 text-white rounded-lg font-semibold text-[14px] hover:opacity-90 transition-opacity"
                style={{ backgroundColor: COLORS.accent }}
              >
                <Phone size={16} />
                {t.contact}
              </a>
              <button
                onClick={() => setShowBooking(false)}
                className="w-full py-2.5 text-gray-500 font-medium text-[14px] hover:text-[#0D1619] transition-colors"
              >
                {t.cancel}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== GALLERY MODAL ===== */}
      {showGallery && (
        <div className="fixed inset-0 bg-black z-50 flex flex-col">
          <div className="flex items-center justify-between p-4 text-white">
            <span className="text-[14px] font-medium">{currentImageIndex + 1} / {galleryImages.length}</span>
            <button
              onClick={() => setShowGallery(false)}
              className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
            >
              <X size={22} />
            </button>
          </div>

          <div className="flex-1 flex items-center justify-center relative px-4">
            <img
              src={galleryImages[currentImageIndex]}
              alt=""
              className="max-w-full max-h-full object-contain"
            />
            <button
              onClick={prevImage}
              className="absolute left-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
            >
              <ChevronLeft size={22} />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
            >
              <ChevronRight size={22} />
            </button>
          </div>

          <div className="p-4 flex gap-2 overflow-x-auto justify-center">
            {galleryImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentImageIndex(idx)}
                className={`flex-shrink-0 w-14 h-14 rounded-md overflow-hidden transition-all ${
                  idx === currentImageIndex ? 'ring-2 ring-white' : 'opacity-40 hover:opacity-70'
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Bottom spacing for sticky bar */}
      {selectedServices.length > 0 && <div className="h-20 lg:h-16" />}
    </div>
  );
}
