'use client';

import React from 'react';
import { Menu } from 'lucide-react';

export const Navbar = () => {
  return (
    <nav className="absolute top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Left: Logo */}
        <div className="text-xl font-bold text-black">BLYSS</div>

        {/* Right: Navigation Items */}
        <div className="flex items-center gap-4">
          {/* List your business button */}
          <button className="px-4 py-2 rounded-full border border-gray-300 text-sm font-semibold text-gray-800 hover:border-gray-400 hover:bg-gray-50 transition-colors">
            List your business
          </button>

          {/* Menu button */}
          <button className="p-2 rounded-full border border-gray-300 hover:bg-gray-50 transition-colors">
            <Menu size={20} strokeWidth={2.5} className="text-gray-800" />
          </button>
        </div>
      </div>
    </nav>
  );
};
