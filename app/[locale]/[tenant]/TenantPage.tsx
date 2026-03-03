'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getDistance, reverseGeocode, setBookingIntent } from './actions';
import { BottomNav } from '@/app/components/layout/BottomNav';
import type { Locale } from '@/lib/i18n';
import { LOCALES } from '@/lib/i18n';
import { motion, AnimatePresence } from 'motion/react';
import {
  Clock,
  MapPin,
  Phone,
  Star,
  Instagram,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  User,
  CalendarCheck,
  ExternalLink,
} from 'lucide-react';

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

interface Employee {
  id: string;
  first_name: string | null;
  last_name: string | null;
  position: string;
  services: {
    id: string;
    service_id: string;
    name: MultilingualText | null;
    price: number;
    duration_minutes: number;
  }[];
}

interface Photo {
  id: string;
  url: string;
  category: 'interior' | 'exterior';
  order: number;
}

interface ReviewStats {
  average_rating: number;
  total_reviews: number;
  rating_distribution: Record<number, number>;
}

interface Review {
  id: string;
  customer_name: string;
  comment: string;
  submitted_at: string;
  rating: number | null;
  services: { service_name: MultilingualText | string; employee_name: string }[];
}

interface Business {
  name: string;
  bio?: string;
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
  cover_url?: string | null;
  review_stats?: ReviewStats | null;
  social_media?: {
    instagram?: string;
  };
  tagline?: string;
  primary_color?: string | null;
}

interface SavedUser {
  phone: string;
  first_name: string;
  last_name: string;
}

interface TenantPageProps {
  business: Business;
  services: Service[];
  employees: Employee[];
  photos: Photo[];
  reviews: Review[];
  tenantSlug: string;
  businessId: string;
  locale: Locale;
  savedUser: SavedUser | null;
}

function secondsToTime(seconds: number): string {
  if (seconds >= 86399) return '24:00';
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

const DAY_NAMES: Record<Locale, Record<string, string>> = {
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

const UI_TEXT: Record<Locale, Record<string, string>> = {
  uz: {
    openUntil: '{{time}} gacha ochiq',
    closedNow: 'Hozir yopiq',
    call: "Qo'ng'iroq qilish",
    location: 'Manzil',
    workingHours: 'Ish vaqti',
    closed: 'Yopiq',
    services: 'Xizmatlar',
    noServices: 'Xizmatlar mavjud emas',
    contact: "Bog'lanish",
    cancel: 'Bekor qilish',
    minute: 'daq',
    hour: 'soat',
    sum: "so'm",
    reviews: 'sharhlar',
    today: 'Bugun',
    seeAllImages: "Hammasini ko'rish",
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
    interior: 'Ichki',
    exterior: 'Tashqi',
    allPhotos: 'Hammasi',
    distanceAway: '{{distance}} uzoqlikda',
    showDistance: 'Masofani ko\'rish',
    locationBlockedTitle: 'Joylashuv ruxsati kerak',
    locationBlockedDesc: 'Masofani ko\'rsatish uchun brauzerda joylashuv ruxsatini yoqing:',
    locationStep1: 'Manzil satridagi qulf (tune) belgisini bosing',
    locationStep2: '"Joylashuv" ni "Ruxsat berish" ga o\'zgartiring',
    locationStep3: 'Sahifani qayta yuklang',
    gotIt: 'Tushunarli',
    specialists: 'Mutaxassislar',
    noSpecialists: 'Mutaxassislar mavjud emas',
    myBookings: 'Mening bronlarim',
    reviewsTitle: 'Sharhlar',
    noReviews: 'Hali sharhlar yo\'q',
    showAllReviews: 'Barcha sharhlarni ko\'rish',
    reviewCount: 'ta sharh',
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
    contact: 'Связаться',
    cancel: 'Отмена',
    minute: 'мин',
    hour: 'ч',
    sum: 'сум',
    reviews: 'отзывов',
    today: 'Сегодня',
    seeAllImages: 'все фото',
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
    interior: 'Интерьер',
    exterior: 'Экстерьер',
    allPhotos: 'Все',
    distanceAway: '{{distance}} от вас',
    showDistance: 'Показать расстояние',
    locationBlockedTitle: 'Требуется доступ к геолокации',
    locationBlockedDesc: 'Чтобы показать расстояние, включите доступ к местоположению в браузере:',
    locationStep1: 'Нажмите на значок замка (tune) в адресной строке',
    locationStep2: 'Измените "Местоположение" на "Разрешить"',
    locationStep3: 'Перезагрузите страницу',
    gotIt: 'Понятно',
    specialists: 'Специалисты',
    noSpecialists: 'Специалисты отсутствуют',
    myBookings: 'Мои записи',
    reviewsTitle: 'Отзывы',
    noReviews: 'Пока нет отзывов',
    showAllReviews: 'Показать все отзывы',
    reviewCount: 'отзывов',
  },
};

const LOCALE_LABELS: Record<Locale, string> = {
  uz: 'UZ',
  ru: 'RU',
};

export function TenantPage({ business, services, employees, photos, reviews, tenantSlug, businessId, locale, savedUser }: TenantPageProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState('');
  const [showGallery, setShowGallery] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [galleryFilter, setGalleryFilter] = useState<'all' | 'interior' | 'exterior'>('all');
  const [showAllHours, setShowAllHours] = useState(false);
  const [distance, setDistance] = useState<{ distance: number; metric: string } | null>(null);
  const [distanceLoading, setDistanceLoading] = useState(false);
  const [distanceDenied, setDistanceDenied] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [geoAddress, setGeoAddress] = useState<string | null>(null);
  const [bookingServiceId, setBookingServiceId] = useState<string | null>(null);
  const [navigatingToBookings, setNavigatingToBookings] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);

  const [activeTab, setActiveTab] = useState('services');
  const [mobileCarouselIndex, setMobileCarouselIndex] = useState(0);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const servicesRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const teamRef = useRef<HTMLDivElement>(null);
  const reviewsRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const mobileCarouselRef = useRef<HTMLDivElement>(null);

  const DISTANCE_CACHE_KEY = `distance_${business.tenant_url}`;
  const ADDRESS_CACHE_KEY = `address_v2_${business.tenant_url}_${locale}`;
  const LOCATION_DENIED_KEY = 'blyss_location_denied';
  const CACHE_TTL = 24 * 60 * 60 * 1000;

  // Build gallery images from photos + cover
  const allPhotos = photos.length > 0
    ? photos.map(p => ({ url: p.url, category: p.category }))
    : [];

  const coverUrl = business.cover_url || null;

  // For the mosaic: cover + first interior + first exterior
  const interiorPhotos = allPhotos.filter(p => p.category === 'interior');
  const exteriorPhotos = allPhotos.filter(p => p.category === 'exterior');

  const mosaicImages: string[] = [];
  if (coverUrl) mosaicImages.push(coverUrl);
  if (interiorPhotos.length > 0 && interiorPhotos[0].url !== coverUrl) mosaicImages.push(interiorPhotos[0].url);
  if (exteriorPhotos.length > 0) mosaicImages.push(exteriorPhotos[0].url);
  for (const p of allPhotos) {
    if (mosaicImages.length >= 5) break;
    if (!mosaicImages.includes(p.url)) mosaicImages.push(p.url);
  }

  const galleryImages = allPhotos.map(p => p.url);
  const hasPhotos = galleryImages.length > 0;

  // Filtered photos for gallery modal
  const filteredGalleryPhotos = galleryFilter === 'all'
    ? allPhotos
    : allPhotos.filter(p => p.category === galleryFilter);

  const getCachedDistance = () => {
    try {
      const raw = localStorage.getItem(DISTANCE_CACHE_KEY);
      if (!raw) return null;
      const cached = JSON.parse(raw);
      if (Date.now() - cached.timestamp < CACHE_TTL) {
        return { distance: cached.distance, metric: cached.metric };
      }
      localStorage.removeItem(DISTANCE_CACHE_KEY);
    } catch { /* ignore */ }
    return null;
  };

  const cacheDistance = (data: { distance: number; metric: string }) => {
    try {
      localStorage.setItem(DISTANCE_CACHE_KEY, JSON.stringify({
        ...data,
        timestamp: Date.now(),
      }));
    } catch { /* ignore */ }
  };

  const fetchDistance = (isManual = false) => {
    if (!business.location?.lat || !business.location?.lng) return;
    if (!navigator.geolocation) return;

    setDistanceLoading(true);
    setDistanceDenied(false);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const slug = business.tenant_url.replace(/\.blyss\.uz$/, '');
          const data = await getDistance(
            slug,
            position.coords.latitude,
            position.coords.longitude
          );
          if (data?.distance !== undefined && data?.metric) {
            const result = { distance: data.distance, metric: data.metric };
            setDistance(result);
            cacheDistance(result);
          }
        } catch {
          // silently fail
        } finally {
          setDistanceLoading(false);
        }
      },
      () => {
        setDistanceLoading(false);
        setDistanceDenied(true);
        try { sessionStorage.setItem(LOCATION_DENIED_KEY, '1'); } catch { /* ignore */ }
        if (isManual) {
          setShowLocationModal(true);
        }
      }
    );
  };

  useEffect(() => {
    const cached = getCachedDistance();
    if (cached) {
      setDistance(cached);
      return;
    }
    try {
      if (sessionStorage.getItem(LOCATION_DENIED_KEY)) {
        setDistanceDenied(true);
        return;
      }
    } catch { /* ignore */ }
    fetchDistance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [business.location, business.tenant_url]);

  useEffect(() => {
    if (!business.location?.lat || !business.location?.lng) return;
    try {
      const raw = localStorage.getItem(ADDRESS_CACHE_KEY);
      if (raw) {
        const cached = JSON.parse(raw);
        if (Date.now() - cached.timestamp < CACHE_TTL) {
          setGeoAddress(cached.address);
          return;
        }
        localStorage.removeItem(ADDRESS_CACHE_KEY);
      }
    } catch { /* ignore */ }
    reverseGeocode(business.location.lat, business.location.lng, locale).then((address) => {
      if (address) {
        setGeoAddress(address);
        try {
          localStorage.setItem(ADDRESS_CACHE_KEY, JSON.stringify({ address, timestamp: Date.now() }));
        } catch { /* ignore */ }
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [business.location, locale]);

  useEffect(() => {
    const isOpen = showGallery || showLocationModal;
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [showGallery, showLocationModal]);

  // Active tab tracking via IntersectionObserver
  useEffect(() => {
    const sectionMap: { id: string; ref: React.RefObject<HTMLDivElement | null> }[] = [
      { id: 'services', ref: servicesRef },
      { id: 'team', ref: teamRef },
      { id: 'reviews', ref: reviewsRef },
      { id: 'about', ref: aboutRef },
    ];
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const match = sectionMap.find(s => s.ref.current === entry.target);
            if (match) setActiveTab(match.id);
          }
        }
      },
      { rootMargin: '-80px 0px -60% 0px', threshold: 0 }
    );
    sectionMap.forEach(({ ref }) => { if (ref.current) observer.observe(ref.current); });
    return () => observer.disconnect();
  }, []);

  const t = UI_TEXT[locale];
  const dayNames = DAY_NAMES[locale];

  const getText = (text: MultilingualText | string | null | undefined): string => {
    if (!text) return '';
    if (typeof text === 'string') return text;
    return text[locale as keyof MultilingualText] || text.ru || text.uz || '';
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

  const getRelativeDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return locale === 'ru' ? 'Сегодня' : 'Bugun';
    if (diffDays === 1) return locale === 'ru' ? 'Вчера' : 'Kecha';
    if (diffDays < 7) return locale === 'ru' ? `${diffDays} дн. назад` : `${diffDays} kun oldin`;
    if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return locale === 'ru' ? `${weeks} нед. назад` : `${weeks} hafta oldin`;
    }
    return date.toLocaleDateString(locale === 'ru' ? 'ru-RU' : 'uz-UZ', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  // Detect /b/ direct route vs subdomain route for navigation
  const pathSegments = pathname.split('/').filter(Boolean);
  const isDirectRoute = pathSegments[1] === 'b';
  const basePath = isDirectRoute ? `/${locale}/b/${pathSegments[2]}` : `/${locale}`;

  const handleBookService = async (service: Service) => {
    setBookingServiceId(service.id);
    document.cookie = `blyss_booking_${businessId}=; path=/; max-age=0`;
    await setBookingIntent(businessId, [service.id]);
    router.push(`${basePath}/booking`);
  };

  const switchLocale = (newLocale: Locale) => {
    const segments = pathname.split('/').filter(Boolean);
    if (segments[1] === 'b') {
      const rest = segments.slice(1);
      router.push(`/${newLocale}/${rest.join('/')}`);
    } else {
      const rest = segments.slice(2);
      const newPath = `/${newLocale}${rest.length > 0 ? '/' + rest.join('/') : ''}`;
      router.push(newPath);
    }
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

  const categories = Object.keys(groupedServices);

  const displayedServices = activeCategory
    ? { [activeCategory]: groupedServices[activeCategory] || [] }
    : groupedServices;

  const openStatus = isOpenNow();
  const closingTime = getClosingTime();
  const primaryColor = business.primary_color || '#088395';

  const LanguageSwitcher = ({ className = '' }: { className?: string }) => (
    <div className={`flex bg-white/90 dark:bg-zinc-800/90 backdrop-blur rounded-full p-0.5 ${className}`}>
      {LOCALES.map((loc) => (
        <button
          key={loc}
          onClick={() => switchLocale(loc)}
          className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-colors ${locale === loc ? 'bg-primary text-white' : 'text-zinc-600 dark:text-zinc-300'}`}
        >
          {LOCALE_LABELS[loc]}
        </button>
      ))}
    </div>
  );

  const LanguageSwitcherDesktop = ({ className = '' }: { className?: string }) => (
    <div className={`flex bg-white/90 dark:bg-zinc-800/90 backdrop-blur rounded-full p-0.5 shadow-sm ${className}`}>
      {LOCALES.map((loc) => (
        <button
          key={loc}
          onClick={() => switchLocale(loc)}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${locale === loc ? 'bg-primary text-white' : 'text-zinc-700 dark:text-zinc-300'}`}
        >
          {LOCALE_LABELS[loc]}
        </button>
      ))}
    </div>
  );

  // Pill badges for metadata
  const MetadataBadges = () => (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-sm text-zinc-500 dark:text-zinc-400">
      {openStatus && closingTime ? (
        <span className="inline-flex items-center gap-1.5 text-green-600 dark:text-green-400 font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          {t.openUntil.replace('{{time}}', closingTime)}
        </span>
      ) : (
        <span className="inline-flex items-center gap-1.5 text-red-500 dark:text-red-400 font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
          {t.closedNow}
        </span>
      )}
      {distanceLoading && (
        <>
          <span className="text-zinc-300 dark:text-zinc-600">&middot;</span>
          <span className="inline-block w-20 h-4 bg-zinc-200 dark:bg-zinc-700 rounded animate-pulse" />
        </>
      )}
      {distance && !distanceLoading && (
        <>
          <span className="text-zinc-300 dark:text-zinc-600">&middot;</span>
          <span className="inline-flex items-center gap-1">
            <MapPin size={13} className="shrink-0" />
            {t.distanceAway.replace('{{distance}}', `${distance.distance} ${distance.metric}`)}
          </span>
        </>
      )}
      {distanceDenied && !distance && !distanceLoading && (
        <>
          <span className="text-zinc-300 dark:text-zinc-600">&middot;</span>
          <button
            onClick={() => fetchDistance(true)}
            className="inline-flex items-center gap-1 text-primary hover:underline font-medium"
          >
            <MapPin size={13} />
            {t.showDistance}
          </button>
        </>
      )}
      {business.review_stats && business.review_stats.total_reviews > 0 && (
        <>
          <span className="text-zinc-300 dark:text-zinc-600">&middot;</span>
          <span className="inline-flex items-center gap-1">
            <Star size={13} className="fill-amber-400 text-amber-400" />
            <span className="font-semibold text-zinc-900 dark:text-zinc-100">{business.review_stats.average_rating}</span>
            <span>({business.review_stats.total_reviews})</span>
          </span>
        </>
      )}
    </div>
  );

  // Rating distribution component
  const RatingDistribution = () => {
    if (!business.review_stats || business.review_stats.total_reviews === 0) return null;
    const { average_rating, total_reviews, rating_distribution } = business.review_stats;
    return (
      <div className="flex items-center gap-6 p-5 bg-zinc-50 dark:bg-zinc-800/40 rounded-2xl mb-5">
        <div className="flex flex-col items-center gap-1">
          <span className="text-5xl font-bold text-zinc-900 dark:text-zinc-100">{average_rating}</span>
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={14} className={i < Math.round(average_rating) ? 'fill-amber-400 text-amber-400' : 'text-zinc-200 dark:text-zinc-700'} />
            ))}
          </div>
          <span className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">{total_reviews} {t.reviewCount}</span>
        </div>
        <div className="flex-1 space-y-1.5">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = rating_distribution[star] || 0;
            const pct = total_reviews > 0 ? (count / total_reviews) * 100 : 0;
            return (
              <div key={star} className="flex items-center gap-2">
                <span className="text-xs text-zinc-400 dark:text-zinc-500 w-3 text-right">{star}</span>
                <div className="flex-1 h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Spinner SVG
  const Spinner = ({ className = 'h-5 w-5' }: { className?: string }) => (
    <svg className={`animate-spin ${className}`} viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );

  return (
    <div className="min-h-screen bg-zinc-50/50 dark:bg-zinc-950" style={{ '--primary': primaryColor } as React.CSSProperties}>

      {/* ===== PHOTO GALLERY / HERO ===== */}
      {hasPhotos && (
        <div ref={heroRef}>
          {/* Desktop mosaic */}
          <div className="hidden lg:block max-w-[1350px] mx-auto px-6 pt-4">
            <div className="relative h-[460px] cursor-pointer overflow-hidden rounded-2xl">
              {mosaicImages.length >= 3 ? (
                <div className="grid grid-cols-4 grid-rows-2 gap-1.5 h-full">
                  <div
                    className="col-span-2 row-span-2 overflow-hidden rounded-l-2xl"
                    onClick={() => { setCurrentImageIndex(0); setShowGallery(true); }}
                  >
                    <img src={mosaicImages[0]} alt={business.name} className="w-full h-full object-cover hover:brightness-95 transition-all duration-300" />
                  </div>
                  <div
                    className="overflow-hidden"
                    onClick={() => { setCurrentImageIndex(1); setShowGallery(true); }}
                  >
                    <img src={mosaicImages[1]} alt="" className="w-full h-full object-cover hover:brightness-95 transition-all duration-300" />
                  </div>
                  <div
                    className="rounded-tr-2xl overflow-hidden"
                    onClick={() => { setCurrentImageIndex(2); setShowGallery(true); }}
                  >
                    <img src={mosaicImages[2]} alt="" className="w-full h-full object-cover hover:brightness-95 transition-all duration-300" />
                  </div>
                  {mosaicImages[3] ? (
                    <div
                      className="overflow-hidden"
                      onClick={() => { setCurrentImageIndex(3); setShowGallery(true); }}
                    >
                      <img src={mosaicImages[3]} alt="" className="w-full h-full object-cover hover:brightness-95 transition-all duration-300" />
                    </div>
                  ) : (
                    <div className="bg-zinc-200 dark:bg-zinc-800" />
                  )}
                  {mosaicImages[4] ? (
                    <div
                      className="rounded-br-2xl overflow-hidden"
                      onClick={() => { setCurrentImageIndex(4); setShowGallery(true); }}
                    >
                      <img src={mosaicImages[4]} alt="" className="w-full h-full object-cover hover:brightness-95 transition-all duration-300" />
                    </div>
                  ) : (
                    <div className="bg-zinc-200 dark:bg-zinc-800 rounded-br-2xl" />
                  )}
                </div>
              ) : mosaicImages.length === 2 ? (
                <div className="grid grid-cols-2 gap-1.5 h-full">
                  <div className="rounded-l-2xl overflow-hidden" onClick={() => { setCurrentImageIndex(0); setShowGallery(true); }}>
                    <img src={mosaicImages[0]} alt={business.name} className="w-full h-full object-cover hover:brightness-95 transition-all duration-300" />
                  </div>
                  <div className="rounded-r-2xl overflow-hidden" onClick={() => { setCurrentImageIndex(1); setShowGallery(true); }}>
                    <img src={mosaicImages[1]} alt="" className="w-full h-full object-cover hover:brightness-95 transition-all duration-300" />
                  </div>
                </div>
              ) : (
                <div className="h-full rounded-2xl overflow-hidden" onClick={() => { setCurrentImageIndex(0); setShowGallery(true); }}>
                  <img src={mosaicImages[0]} alt={business.name} className="w-full h-full object-cover hover:brightness-95 transition-all duration-300" />
                </div>
              )}
              {/* Gradient overlay */}
              <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/20 to-transparent pointer-events-none rounded-b-2xl" />
              {/* See all photos */}
              {galleryImages.length > 3 && (
                <button
                  onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(0); setShowGallery(true); }}
                  className="absolute bottom-4 right-4 px-5 py-2.5 bg-white text-zinc-900 rounded-lg shadow-lg text-sm font-semibold border border-zinc-200 hover:bg-zinc-50 transition-colors"
                >
                  {t.seeAllImages} ({galleryImages.length})
                </button>
              )}
              <div className="absolute top-4 right-4 flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                <LanguageSwitcherDesktop />
              </div>
            </div>
          </div>

          {/* Mobile carousel */}
          <div className="lg:hidden relative">
            <div
              ref={mobileCarouselRef}
              className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide h-[280px]"
              onScroll={(e) => {
                const el = e.currentTarget;
                const idx = Math.round(el.scrollLeft / el.clientWidth);
                setMobileCarouselIndex(idx);
              }}
            >
              {mosaicImages.map((url, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 w-full h-full snap-center cursor-pointer"
                  onClick={() => { setCurrentImageIndex(i); setShowGallery(true); }}
                >
                  <img src={url} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
            {/* Gradient */}
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
            {/* Pill dot indicators */}
            {mosaicImages.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 items-center">
                {mosaicImages.map((_, i) => (
                  <div
                    key={i}
                    className={`h-2 rounded-full transition-all duration-300 ${i === mobileCarouselIndex ? 'w-6 bg-white' : 'w-2 bg-white/50'}`}
                  />
                ))}
              </div>
            )}
            <div className="absolute top-3 right-3" onClick={(e) => e.stopPropagation()}>
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      )}

      {/* ===== NO PHOTOS: Profile Header ===== */}
      {!hasPhotos && (
        <div ref={heroRef} className="bg-white dark:bg-zinc-900 border-b border-zinc-100 dark:border-zinc-800/50">
          <div className="max-w-[1350px] mx-auto px-4 lg:px-6 py-6 lg:py-10">
            <div className="flex items-center gap-4 lg:gap-5">
              {/* Avatar */}
              <div
                className={`w-20 h-20 lg:w-24 lg:h-24 rounded-full bg-center bg-cover flex-shrink-0 overflow-hidden ${business.avatar_url ? 'ring-4 ring-white dark:ring-zinc-800 shadow-lg' : ''}`}
                style={business.avatar_url ? { backgroundImage: `url(${business.avatar_url})` } : undefined}
              >
                {!business.avatar_url && (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/80 to-primary rounded-full">
                    <span className="text-2xl lg:text-3xl font-bold text-white">{business.name.charAt(0)}</span>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl lg:text-3xl font-bold text-zinc-900 dark:text-zinc-100 leading-tight tracking-tight truncate">
                  {business.name}
                </h1>
                {business.tagline && (
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">{business.tagline}</p>
                )}
                <MetadataBadges />
              </div>
              <div className="flex-shrink-0 lg:hidden self-start">
                <LanguageSwitcher />
              </div>
              <div className="flex-shrink-0 hidden lg:block self-start">
                <LanguageSwitcherDesktop />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== STICKY TAB NAVIGATION ===== */}
      <div ref={tabsRef} className="sticky top-0 z-30 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 shadow-[0_1px_3px_0_rgb(0_0_0/0.04)]">
        <div className="max-w-[1350px] mx-auto px-4 lg:px-6">
          <nav className="flex gap-1 overflow-x-auto scrollbar-hide">
            {[
              { id: 'services', label: t.services, ref: servicesRef, show: true },
              { id: 'team', label: t.specialists, ref: teamRef, show: employees.length > 0 },
              { id: 'reviews', label: t.reviewsTitle, ref: reviewsRef, show: reviews.length > 0 },
              { id: 'about', label: t.about, ref: aboutRef, show: true },
            ]
              .filter(tab => tab.show)
              .map(tab => (
                <button
                  key={tab.id}
                  onClick={() => {
                    tab.ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    setActiveTab(tab.id);
                  }}
                  className={`relative px-5 py-3.5 text-sm lg:text-[15px] whitespace-nowrap transition-colors duration-200 ${
                    activeTab === tab.id
                      ? 'text-zinc-900 dark:text-zinc-100 font-semibold'
                      : 'text-zinc-400 dark:text-zinc-500 font-medium hover:text-zinc-600 dark:hover:text-zinc-300'
                  }`}
                >
                  {tab.label}
                  {tab.id === 'reviews' && reviews.length > 0 && (
                    <span className="ml-1.5 text-xs bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 px-1.5 py-0.5 rounded-full">{reviews.length}</span>
                  )}
                  {activeTab === tab.id && (
                    <motion.span
                      layoutId="activeTabIndicator"
                      className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-primary rounded-full"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              ))}
          </nav>
        </div>
      </div>

      {/* ===== MAIN CONTENT ===== */}
      <div className="max-w-[1350px] mx-auto px-4 lg:px-6 pb-24 lg:pb-20">
        <div className="lg:grid lg:grid-cols-[1fr_380px] lg:gap-8">

          {/* ===== LEFT COLUMN ===== */}
          <div>

            {/* Business info below photos */}
            {hasPhotos && (
              <div className="pt-6 lg:pt-8 pb-4 border-b border-zinc-100 dark:border-zinc-800/50">
                <div className="flex items-start gap-3">
                  {business.avatar_url && (
                    <div
                      className="w-12 h-12 rounded-full bg-center bg-cover flex-shrink-0 ring-2 ring-white dark:ring-zinc-800 shadow"
                      style={{ backgroundImage: `url(${business.avatar_url})` }}
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <h1 className="text-2xl lg:text-3xl font-bold text-zinc-900 dark:text-zinc-100 leading-tight tracking-tight">
                      {business.name}
                    </h1>
                    {business.tagline && (
                      <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">{business.tagline}</p>
                    )}
                  </div>
                </div>
                <MetadataBadges />
              </div>
            )}

            {/* ===== SERVICES ===== */}
            <div ref={servicesRef} className="scroll-mt-16">
              <div className={`pb-4 ${!hasPhotos ? 'pt-6 lg:pt-8' : 'pt-6'}`}>
                <h2 className="text-xl lg:text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                  {t.services}
                  <span className="text-sm font-normal text-zinc-400 dark:text-zinc-500 ml-2">{services.length}</span>
                </h2>
              </div>

              {/* Search */}
              <div className="mb-5">
                <div className="relative">
                  <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300 dark:text-zinc-600" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t.searchServices}
                    className="w-full pl-11 pr-10 py-3 bg-zinc-50 dark:bg-zinc-800/60 border border-transparent rounded-2xl text-base text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:bg-white dark:focus:bg-zinc-900 focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all duration-200"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-full transition-colors"
                    >
                      <X size={14} className="text-zinc-400" />
                    </button>
                  )}
                </div>
              </div>

              {/* Category pills */}
              {categories.length > 1 && !searchQuery && (
                <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-4 -mx-1 px-1">
                  <button
                    onClick={() => setActiveCategory(null)}
                    className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      activeCategory === null
                        ? 'bg-primary text-white shadow-sm'
                        : 'bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-700'
                    }`}
                  >
                    {t.allPhotos}
                  </button>
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat === activeCategory ? null : cat)}
                      className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium capitalize transition-all duration-200 ${
                        activeCategory === cat
                          ? 'bg-primary text-white shadow-sm'
                          : 'bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-700'
                      }`}
                    >
                      {cat === 'general' ? t.general : cat}
                    </button>
                  ))}
                </div>
              )}

              {/* Service items */}
              {Object.keys(displayedServices).length > 0 ? (
                Object.entries(displayedServices).map(([category, categoryServices]) => (
                  <div key={category} className="mb-6">
                    {categories.length > 1 && !activeCategory && (
                      <h3 className="text-base lg:text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-3 capitalize">
                        {category === 'general' ? t.general : category}
                      </h3>
                    )}
                    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 overflow-hidden">
                      {categoryServices.map((service, idx) => (
                        <motion.div
                          key={service.id}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.03, duration: 0.3 }}
                          className={`flex items-center justify-between px-4 lg:px-5 py-4 group hover:bg-zinc-50/80 dark:hover:bg-zinc-800/30 transition-colors duration-150 ${
                            idx > 0 ? 'border-t border-zinc-100 dark:border-zinc-800' : ''
                          }`}
                        >
                          <div className="flex-1 min-w-0 pr-4">
                            <h4 className="text-[15px] lg:text-base font-semibold text-zinc-900 dark:text-zinc-100 line-clamp-1">
                              {getText(service.name)}
                            </h4>
                            <p className="text-sm text-zinc-400 dark:text-zinc-500 mt-0.5">
                              {formatDuration(service.duration_minutes)} &middot; {formatPrice(service.price)} {t.sum}
                            </p>
                            {service.description && getText(service.description) && (
                              <p className="text-sm text-zinc-400 dark:text-zinc-500 mt-1 line-clamp-1">
                                {getText(service.description)}
                              </p>
                            )}
                          </div>
                          <button
                            onClick={() => handleBookService(service)}
                            disabled={bookingServiceId === service.id}
                            className="flex-shrink-0 px-5 py-2 rounded-full text-sm font-semibold border-2 border-primary text-primary bg-transparent hover:bg-primary hover:text-white transition-all duration-200 disabled:opacity-70 flex items-center gap-1.5"
                          >
                            {bookingServiceId === service.id && <Spinner className="h-4 w-4" />}
                            {t.book}
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-16 text-center">
                  <Search size={32} className="mx-auto text-zinc-200 dark:text-zinc-700 mb-3" />
                  <p className="text-zinc-400 dark:text-zinc-500 text-sm">{t.noServices}</p>
                </div>
              )}
            </div>

            {/* ===== TEAM / SPECIALISTS ===== */}
            {employees.length > 0 && (
              <motion.div
                ref={teamRef}
                className="mt-10 scroll-mt-16"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
              >
                <div className="pb-4">
                  <h2 className="text-xl lg:text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                    {t.specialists}
                  </h2>
                </div>
                <div className="flex gap-3 overflow-x-auto pb-3 scrollbar-hide snap-x snap-mandatory -mx-1 px-1">
                  {employees.map((employee) => {
                    const name = [employee.first_name, employee.last_name].filter(Boolean).join(' ');
                    const initial = (employee.first_name || employee.position || '?').charAt(0).toUpperCase();
                    return (
                      <motion.div
                        key={employee.id}
                        className="flex flex-col items-center flex-shrink-0 w-[140px] lg:w-[160px] p-4 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 hover:shadow-md hover:border-zinc-200 dark:hover:border-zinc-700 transition-all duration-200 snap-start cursor-default"
                        whileHover={{ y: -2 }}
                      >
                        <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 dark:from-primary/30 dark:to-primary/10 flex items-center justify-center">
                          <span className="text-xl lg:text-2xl font-bold text-primary">{initial}</span>
                        </div>
                        <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mt-3 text-center line-clamp-1">
                          {name || employee.position}
                        </p>
                        {name && employee.position && (
                          <p className="text-sm text-zinc-400 dark:text-zinc-500 text-center line-clamp-1 mt-0.5">
                            {employee.position}
                          </p>
                        )}
                        <p className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-2">{employee.services.length} {t.services.toLowerCase()}</p>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* ===== REVIEWS ===== */}
            {reviews.length > 0 && (
              <motion.div
                ref={reviewsRef}
                className="mt-10 scroll-mt-16"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
              >
                <div className="pb-4">
                  <h2 className="text-xl lg:text-2xl font-bold text-zinc-900 dark:text-zinc-100">{t.reviewsTitle}</h2>
                </div>

                <RatingDistribution />

                <div className="space-y-3">
                  {(showAllReviews ? reviews : reviews.slice(0, 3)).map((review, idx) => (
                    <motion.div
                      key={review.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05, duration: 0.3 }}
                      className="bg-white dark:bg-zinc-900 rounded-2xl p-5 border border-zinc-100 dark:border-zinc-800"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center">
                            <span className="text-sm font-bold text-primary">{review.customer_name.charAt(0)}</span>
                          </div>
                          <div>
                            {review.services.length > 0 && (
                              <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 line-clamp-1">
                                {review.services.map(svc => getText(svc.service_name)).join(', ')}
                              </p>
                            )}
                            <p className="text-xs text-zinc-400 dark:text-zinc-500">
                              {review.submitted_at ? getRelativeDate(review.submitted_at) : ''}
                            </p>
                          </div>
                        </div>
                        {review.rating && (
                          <div className="flex items-center gap-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                size={14}
                                className={i < Math.round(review.rating!) ? 'fill-amber-400 text-amber-400' : 'text-zinc-200 dark:text-zinc-700'}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                      {review.comment && (
                        <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">{review.comment}</p>
                      )}
                    </motion.div>
                  ))}
                </div>
                {reviews.length > 3 && !showAllReviews && (
                  <button
                    onClick={() => setShowAllReviews(true)}
                    className="w-full mt-4 py-3 border-2 border-zinc-200 dark:border-zinc-700 rounded-2xl text-sm font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                  >
                    {t.showAllReviews} ({reviews.length})
                  </button>
                )}
              </motion.div>
            )}
          </div>

          {/* ===== RIGHT: DESKTOP SIDEBAR ===== */}
          <div className="hidden lg:block" ref={aboutRef}>
            <div className="sticky top-16 space-y-4 pt-6">
              {/* Book Now / My Bookings CTA */}
              {savedUser ? (
                <button
                  onClick={() => { setNavigatingToBookings(true); router.push(`${basePath}/bookings`); }}
                  disabled={navigatingToBookings}
                  className="flex items-center justify-center gap-2 w-full py-3.5 bg-primary text-white rounded-2xl font-semibold text-base hover:bg-primary/90 transition-colors disabled:opacity-70 shadow-sm shadow-primary/20"
                >
                  {navigatingToBookings ? <Spinner /> : <CalendarCheck size={20} />}
                  {t.myBookings}
                </button>
              ) : (
                <button
                  onClick={() => servicesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                  className="flex items-center justify-center gap-2 w-full py-3.5 bg-primary text-white rounded-2xl font-semibold text-base hover:bg-primary/90 transition-colors shadow-sm shadow-primary/20"
                >
                  <CalendarCheck size={20} />
                  {t.bookNow}
                </button>
              )}

              {/* Map */}
              <div className="bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-100 dark:border-zinc-800 shadow-sm">
                <div className="aspect-[16/10] bg-zinc-100 dark:bg-zinc-800 relative">
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
                      <MapPin size={28} className="text-zinc-300 dark:text-zinc-600" />
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <p className="text-base font-semibold text-zinc-900 dark:text-zinc-100">{business.name}</p>
                  {(geoAddress || business.location?.address) && (
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5 capitalize">{geoAddress || business.location?.address}</p>
                  )}
                  {business.location?.lat && business.location?.lng && (
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${business.location.lat},${business.location.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm font-medium mt-2 text-primary hover:underline"
                    >
                      {t.getDirections}
                      <ExternalLink size={12} />
                    </a>
                  )}
                </div>
              </div>

              {/* Working Hours */}
              <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-4">
                <h4 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-3">{t.workingHours}</h4>
                {business.working_hours && (
                  <div className="space-y-1">
                    {DAY_ORDER.map((day) => {
                      const hours = business.working_hours?.[day];
                      const isToday = day === getTodayName();
                      return (
                        <div
                          key={day}
                          className={`flex justify-between text-sm py-2 px-3 rounded-lg transition-colors ${isToday ? 'bg-primary/10 dark:bg-primary/20' : ''}`}
                        >
                          <span className={isToday ? 'font-medium text-primary' : hours?.is_open ? 'text-zinc-600 dark:text-zinc-400' : 'text-zinc-400 dark:text-zinc-500'}>
                            {dayNames[day]}
                          </span>
                          <span className={isToday ? 'font-medium text-primary' : hours?.is_open ? 'text-zinc-900 dark:text-zinc-100' : 'text-red-400 dark:text-red-500'}>
                            {hours?.is_open
                              ? `${secondsToTime(hours.start)} – ${secondsToTime(hours.end)}`
                              : t.closed}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Contact */}
              <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-4">
                <h4 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-3">{t.contact}</h4>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-zinc-600 dark:text-zinc-400">+{business.business_phone_number}</span>
                  <a
                    href={`tel:${business.business_phone_number}`}
                    className="px-4 py-1.5 rounded-lg border border-primary text-primary text-sm font-medium hover:bg-primary/5 transition-colors"
                  >
                    {t.call}
                  </a>
                </div>
                {business.social_media?.instagram && (
                  <div className="flex items-center gap-2.5 mt-3 pt-3 border-t border-zinc-100 dark:border-zinc-800">
                    <Instagram size={16} className="text-primary" />
                    <a
                      href={`https://instagram.com/${business.social_media.instagram}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline font-medium"
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
        <motion.div
          className="lg:hidden mt-10 space-y-3 scroll-mt-16"
          ref={aboutRef}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          {/* Map */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-100 dark:border-zinc-800 shadow-sm">
            <div className="aspect-[16/10] bg-zinc-100 dark:bg-zinc-800">
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
                  <MapPin size={28} className="text-zinc-300 dark:text-zinc-600" />
                </div>
              )}
            </div>
            <div className="p-4">
              <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{business.name}</p>
              {(geoAddress || business.location?.address) && (
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 capitalize">{geoAddress || business.location?.address}</p>
              )}
              {business.location?.lat && business.location?.lng && (
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${business.location.lat},${business.location.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-medium mt-2 text-primary hover:underline"
                >
                  {t.getDirections}
                  <ExternalLink size={12} />
                </a>
              )}
            </div>
          </div>

          {/* Call */}
          <a
            href={`tel:${business.business_phone_number}`}
            className="flex items-center justify-center gap-2.5 w-full py-3.5 bg-primary text-white rounded-2xl font-semibold text-base shadow-sm shadow-primary/20 active:scale-[0.98] transition-transform"
          >
            <Phone size={18} />
            {t.call} +{business.business_phone_number}
          </a>

          {/* Hours - collapsible */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 overflow-hidden">
            <button
              onClick={() => setShowAllHours(!showAllHours)}
              className="w-full flex items-center justify-between p-4"
            >
              <div className="flex items-center gap-2.5">
                <Clock size={16} className="text-primary" />
                <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{t.workingHours}</span>
              </div>
              <div className="flex items-center gap-2">
                {openStatus && closingTime && (
                  <span className="text-xs font-medium text-green-600 dark:text-green-400">
                    {t.openUntil.replace('{{time}}', closingTime)}
                  </span>
                )}
                <motion.div animate={{ rotate: showAllHours ? 180 : 0 }} transition={{ duration: 0.2 }}>
                  <ChevronDown size={16} className="text-zinc-400" />
                </motion.div>
              </div>
            </button>
            <AnimatePresence>
              {showAllHours && business.working_hours && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4 space-y-1">
                    {DAY_ORDER.map((day) => {
                      const hours = business.working_hours?.[day];
                      const isToday = day === getTodayName();
                      return (
                        <div
                          key={day}
                          className={`flex justify-between text-sm py-2 px-3 rounded-lg ${isToday ? 'bg-primary/10 dark:bg-primary/20' : ''}`}
                        >
                          <span className={isToday ? 'font-medium text-primary' : hours?.is_open ? 'text-zinc-600 dark:text-zinc-400' : 'text-zinc-400 dark:text-zinc-500'}>
                            {dayNames[day]}
                          </span>
                          <span className={isToday ? 'font-medium text-primary' : hours?.is_open ? 'text-zinc-900 dark:text-zinc-100' : 'text-zinc-400 dark:text-zinc-500'}>
                            {hours?.is_open
                              ? `${secondsToTime(hours.start)} – ${secondsToTime(hours.end)}`
                              : t.closed}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Instagram */}
          {business.social_media?.instagram && (
            <a
              href={`https://instagram.com/${business.social_media.instagram}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-4 py-3.5 border border-zinc-100 dark:border-zinc-800 rounded-2xl bg-white dark:bg-zinc-900"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 via-pink-500 to-purple-600 flex items-center justify-center">
                <Instagram size={16} className="text-white" />
              </div>
              <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">@{business.social_media.instagram}</span>
            </a>
          )}
        </motion.div>
      </div>

      {/* ===== LOCATION PERMISSION MODAL ===== */}
      <AnimatePresence>
        {showLocationModal && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-end lg:items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowLocationModal(false)}
          >
            <motion.div
              className="bg-white dark:bg-zinc-900 w-full lg:w-[420px] rounded-t-[28px] lg:rounded-2xl overflow-hidden"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Drag handle */}
              <div className="flex justify-center pt-3 lg:hidden">
                <div className="w-10 h-1 bg-zinc-300 dark:bg-zinc-700 rounded-full" />
              </div>
              <div className="flex justify-center pt-5 pb-2">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <MapPin size={28} className="text-primary" />
                </div>
              </div>
              <div className="px-6 pb-2 text-center">
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                  {t.locationBlockedTitle}
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">
                  {t.locationBlockedDesc}
                </p>
              </div>
              <div className="px-6 py-4 space-y-3">
                {[t.locationStep1, t.locationStep2, t.locationStep3].map((step, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-primary">{i + 1}</span>
                    </div>
                    <p className="text-sm text-zinc-700 dark:text-zinc-300">{step}</p>
                  </div>
                ))}
              </div>
              <div className="px-6 pb-7 pt-2">
                <button
                  onClick={() => setShowLocationModal(false)}
                  className="w-full py-3.5 bg-primary text-white rounded-2xl font-semibold text-sm active:scale-[0.98] transition-transform"
                >
                  {t.gotIt}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== MOBILE BOTTOM NAV ===== */}
      <BottomNav locale={locale} />

      {/* ===== GALLERY MODAL ===== */}
      <AnimatePresence>
        {showGallery && hasPhotos && (
          <motion.div
            className="fixed inset-0 bg-black z-50 flex flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center justify-between p-4 text-white">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium">{currentImageIndex + 1} / {filteredGalleryPhotos.length}</span>
                <div className="flex gap-1.5 ml-4">
                  {(['all', 'interior', 'exterior'] as const).map((cat) => {
                    const count = cat === 'all' ? allPhotos.length : allPhotos.filter(p => p.category === cat).length;
                    if (count === 0 && cat !== 'all') return null;
                    return (
                      <button
                        key={cat}
                        onClick={() => { setGalleryFilter(cat); setCurrentImageIndex(0); }}
                        className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${galleryFilter === cat ? 'bg-white text-black' : 'bg-white/15 text-white hover:bg-white/25'}`}
                      >
                        {cat === 'all' ? t.allPhotos : cat === 'interior' ? t.interior : t.exterior} ({count})
                      </button>
                    );
                  })}
                </div>
              </div>
              <button
                onClick={() => setShowGallery(false)}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
              >
                <X size={22} />
              </button>
            </div>

            <div className="flex-1 flex items-center justify-center relative px-4">
              <AnimatePresence mode="wait">
                {filteredGalleryPhotos.length > 0 && (
                  <motion.img
                    key={currentImageIndex}
                    src={filteredGalleryPhotos[currentImageIndex]?.url || ''}
                    alt=""
                    className="max-w-full max-h-full object-contain"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  />
                )}
              </AnimatePresence>
              {filteredGalleryPhotos.length > 1 && (
                <>
                  <button
                    onClick={() => setCurrentImageIndex((prev) => (prev - 1 + filteredGalleryPhotos.length) % filteredGalleryPhotos.length)}
                    className="absolute left-4 w-12 h-12 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    onClick={() => setCurrentImageIndex((prev) => (prev + 1) % filteredGalleryPhotos.length)}
                    className="absolute right-4 w-12 h-12 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
                  >
                    <ChevronRight size={24} />
                  </button>
                </>
              )}
            </div>

            <div className="p-4 flex gap-2 overflow-x-auto justify-center">
              {filteredGalleryPhotos.map((photo, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden transition-all ${idx === currentImageIndex ? 'ring-2 ring-primary ring-offset-2 ring-offset-black' : 'opacity-40 hover:opacity-70'}`}
                >
                  <img src={photo.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
