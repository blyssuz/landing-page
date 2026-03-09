'use client';

import Link from 'next/link';
import { CalendarCheck, Phone } from 'lucide-react';
import type { Locale, Business } from '../_lib/types';

interface BottomNavProps {
  locale: Locale;
  business: Business;
  basePath: string;
  translations: { myBookings: string; bookNow: string; call: string };
}

export function BottomNav({
  business,
  basePath,
  translations,
}: BottomNavProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white/95 backdrop-blur-md border-t border-stone-100 pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-center justify-around px-4 py-2">
        {/* Left: Bookings */}
        <Link
          href={`${basePath}/bookings`}
          className="flex flex-col items-center gap-0.5 text-stone-400"
        >
          <CalendarCheck size={22} strokeWidth={1.8} />
          <span className="text-[11px] font-medium">{translations.myBookings}</span>
        </Link>

        {/* Center: Book CTA (elevated) */}
        <Link
          href={`${basePath}#services`}
          className="flex flex-col items-center gap-0.5 -mt-3 rounded-full bg-primary text-white px-6 py-2.5 active:scale-95 transition-transform"
        >
          <CalendarCheck size={20} strokeWidth={2} />
          <span className="text-[11px] font-semibold">{translations.bookNow}</span>
        </Link>

        {/* Right: Call */}
        <a
          href={`tel:${business.business_phone_number}`}
          className="flex flex-col items-center gap-0.5 text-stone-400"
        >
          <Phone size={22} strokeWidth={1.8} />
          <span className="text-[11px] font-medium">{translations.call}</span>
        </a>
      </div>
    </div>
  );
}
