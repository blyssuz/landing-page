'use client';

import { Phone, Instagram } from 'lucide-react';
import { Button } from '@/app/components/ui/Button';

interface ContactInfoProps {
  phone: string;
  instagram?: string;
  translations: { call: string; contact: string };
  variant?: 'sidebar' | 'mobile';
}

export function ContactInfo({
  phone,
  instagram,
  translations,
  variant = 'sidebar',
}: ContactInfoProps) {
  if (variant === 'mobile') {
    return (
      <div className="space-y-3">
        {/* Full-width call button */}
        <a href={`tel:${phone}`} className="block">
          <Button variant="primary" className="w-full rounded-xl py-3 text-sm font-semibold gap-2">
            <Phone size={16} />
            {translations.call} +{phone}
          </Button>
        </a>

        {/* Instagram link */}
        {instagram && (
          <a
            href={`https://instagram.com/${instagram}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-3.5 py-3 border border-stone-100 rounded-xl bg-white"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 via-pink-500 to-purple-600 flex items-center justify-center">
              <Instagram size={16} className="text-white" />
            </div>
            <span className="text-sm font-medium text-stone-900">@{instagram}</span>
          </a>
        )}
      </div>
    );
  }

  // Sidebar variant
  return (
    <div>
      <h4 className="text-base font-semibold text-stone-900 mb-3">{translations.contact}</h4>
      <div className="flex items-center justify-between">
        <span className="text-sm text-stone-600">+{phone}</span>
        <a href={`tel:${phone}`}>
          <Button variant="outline" size="sm" className="gap-1.5">
            <Phone size={14} />
            {translations.call}
          </Button>
        </a>
      </div>
      {instagram && (
        <div className="flex items-center gap-2.5 mt-3 pt-3 border-t border-stone-100">
          <Instagram size={16} className="text-primary" />
          <a
            href={`https://instagram.com/${instagram}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary hover:underline font-medium"
          >
            @{instagram}
          </a>
        </div>
      )}
    </div>
  );
}
