import type { Metadata } from 'next';
import { Navbar } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";
import { HeroSection } from "./components/hero/HeroSection";
import { GradientBlobs } from "./components/hero/GradientBlobs";
import { VenueSection } from "./components/venues/VenueSection";
import { ReviewsSection } from "./components/reviews/ReviewsSection";
import { StatsSection } from "./components/stats/StatsSection";
import { DownloadAppSection } from "./components/download/DownloadAppSection";
import { ForBusinessSection } from "./components/business/ForBusinessSection";
import { BrowseByCitySection } from "./components/browse/BrowseByCitySection";
import {
  recentlyViewed,
  recommended,
  newVenues,
  trending,
} from "../data/venues";

export const metadata: Metadata = {
  title: 'Blyss — Book Beauty & Wellness Services | Онлайн-запись в салоны красоты | Go\'zallik xizmatlari',
  description:
    'Discover and book top-rated salons, barbers, spas and wellness studios in Uzbekistan. No app needed — open in Telegram. | Найдите и запишитесь к лучшим мастерам Узбекистана — салоны красоты, барбершопы, спа. Откройте в Telegram — без скачивания. | O\'zbekistondagi eng yaxshi salonlar, sartaroshxonalar, spa va velnes studiyalarni toping va onlayn yoziling. Telegram orqali oching — yuklab olish shart emas.',
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Blyss',
  url: 'https://blyss.uz',
  description:
    'Online booking platform for beauty and wellness services in Uzbekistan. Book salons, barbers, spas, and wellness studios. | Платформа онлайн-записи в салоны красоты и велнес-студии Узбекистана. | Go\'zallik va sog\'lomlashtirish xizmatlarini onlayn band qilish platformasi.',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web, Telegram',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'UZS',
    description: 'Free for customers to book appointments | Бесплатно для клиентов | Mijozlar uchun bepul',
  },
  areaServed: {
    '@type': 'Country',
    name: 'Uzbekistan',
  },
  provider: {
    '@type': 'Organization',
    name: 'Blyss',
    url: 'https://blyss.uz',
    logo: 'https://blyss.uz/icon-512.png',
    sameAs: [
      'https://t.me/blyssuz',
    ],
  },
  inLanguage: ['en', 'ru', 'uz'],
};

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-black">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />

      <main>
        {/* Hero + Recently viewed share the gradient background */}
        <div className="relative overflow-hidden">
          <GradientBlobs />

          <div className="relative z-[1]">
            <HeroSection />
            <VenueSection title="Recently viewed" venues={recentlyViewed} />
          </div>

          {/* Fade out at the bottom */}
          <div
            className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none z-10"
            style={{ background: 'linear-gradient(to bottom, transparent, white)' }}
          />
        </div>

        <div className="flex flex-col w-full gap-6 mt-4">
          <VenueSection title="Recommended" venues={recommended} />
          <VenueSection title="New to Blyss" venues={newVenues} />
          <VenueSection title="Trending" venues={trending} />
        </div>

        {/* <ReviewsSection /> */}

        {/* <StatsSection /> */}

        {/* <DownloadAppSection /> */}

        <ForBusinessSection />

        <BrowseByCitySection />
      </main>

      {/* <Footer /> */}
    </div>
  );
}
