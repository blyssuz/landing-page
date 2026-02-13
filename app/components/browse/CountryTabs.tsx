'use client';

interface CountryTabsProps {
  countries: string[];
  activeCountry: string;
  onSelect: (country: string) => void;
}

export function CountryTabs({
  countries,
  activeCountry,
  onSelect,
}: CountryTabsProps) {
  return (
    <div className="overflow-x-auto scrollbar-hide">
      <div className="flex flex-wrap gap-2">
        {countries.map((country) => (
          <button
            key={country}
            onClick={() => onSelect(country)}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              activeCountry === country
                ? 'bg-black text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {country}
          </button>
        ))}
      </div>
    </div>
  );
}
