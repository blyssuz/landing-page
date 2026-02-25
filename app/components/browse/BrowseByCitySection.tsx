'use client';

import { regions } from '@/data/cities';
import { useLocale } from '@/lib/locale-context';
import translations from '@/lib/translations';

export function BrowseByCitySection() {
  const locale = useLocale();

  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <h2 className="text-2xl font-bold mb-8">{translations.browse.title[locale]}</h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
        {regions.map((region) => (
          <div key={region.id}>
            <h3 className="font-semibold text-base mb-3">{region.name[locale]}</h3>
            <ul className="space-y-2">
              {region.services.map((service) => (
                <li key={service.slug}>
                  <a
                    href={`/${locale}/${region.id}/${service.slug}`}
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
                  >
                    {locale === 'ru'
                      ? `${service.name.ru} ${translations.browse.inCity[locale]} ${region.name.ru}`
                      : `${region.name.uz} ${service.name.uz}`
                    }
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
