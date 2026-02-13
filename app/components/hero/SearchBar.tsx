'use client';

import { Search, MapPin } from 'lucide-react';

export const SearchBar = () => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      {/* Desktop Layout */}
      <div
        className="hidden md:block rounded-full p-[4px] shadow-lg"
        style={{
          background: 'linear-gradient(to right, color-mix(in srgb, var(--blob-rose, #f472b6) 25%, transparent), color-mix(in srgb, var(--blob-blue, #7dd3fc) 25%, transparent))',
        }}
      >
        <div className="flex bg-white rounded-full overflow-hidden p-1">
          {/* Field 1: Search Input */}
          <div className="flex items-center gap-2 px-4 py-3 flex-1 rounded-full hover:bg-gray-100 transition-colors">
            <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="All treatments and venues"
              className="bg-transparent text-base font-semibold text-gray-900 placeholder-gray-800 outline-none focus:outline-none focus-visible:outline-none flex-1"
            />
          </div>

          {/* Field 2: Location Input */}
          <div className="flex items-center gap-2 px-4 py-3 flex-1 rounded-full hover:bg-gray-100 transition-colors">
            <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="Current location"
              className="bg-transparent text-base font-semibold text-gray-900 placeholder-gray-800 outline-none focus:outline-none focus-visible:outline-none flex-1"
            />
          </div>

          {/* Search Button */}
          <button className="bg-black text-white rounded-full px-6 py-3 font-semibold hover:bg-gray-900 transition-colors flex items-center gap-2 whitespace-nowrap">
            <Search className="w-5 h-5" />
            Search
          </button>
        </div>
      </div>

      {/* Mobile Layout */}
      <div
        className="md:hidden rounded-2xl p-[4px] shadow-lg"
        style={{
          background: 'linear-gradient(to right, color-mix(in srgb, var(--blob-rose, #f472b6) 25%, transparent), color-mix(in srgb, var(--blob-blue, #7dd3fc) 25%, transparent))',
        }}
      >
        <div className="flex flex-col gap-3 bg-white rounded-2xl p-4">
          {/* Field 1: Search Input */}
          <div className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg">
            <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="All treatments and venues"
              className="bg-transparent text-sm font-semibold text-gray-900 placeholder-gray-800 outline-none focus:outline-none focus-visible:outline-none flex-1"
            />
          </div>

          {/* Field 2: Location Input */}
          <div className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg">
            <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="Current location"
              className="bg-transparent text-sm font-semibold text-gray-900 placeholder-gray-800 outline-none focus:outline-none focus-visible:outline-none flex-1"
            />
          </div>

          {/* Search Button */}
          <button className="w-full bg-black text-white rounded-lg px-4 py-3 font-semibold hover:bg-gray-900 transition-colors flex items-center justify-center gap-2">
            <Search className="w-5 h-5" />
            Search
          </button>
        </div>
      </div>
    </div>
  );
};
