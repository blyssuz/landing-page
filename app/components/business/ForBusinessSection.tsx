import React from 'react';
import { ArrowRight, Star } from 'lucide-react';

export const ForBusinessSection: React.FC = () => {
  return (
    <section className="bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="flex flex-col justify-center">
            {/* Heading */}
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Blyss for business
            </h2>

            {/* Description */}
            <p className="text-gray-600 mb-8 leading-relaxed">
              Manage your bookings, calendar, payments, and customer relationships
              all in one powerful platform. Grow your business with Blyss's
              intuitive tools designed for service professionals and their teams.
            </p>

            {/* Find Out More Button */}
            <button className="w-fit px-6 py-3 bg-black text-white rounded-full font-medium hover:bg-gray-900 transition-colors flex items-center gap-2 mb-8">
              Find out more
              <ArrowRight className="w-5 h-5" />
            </button>
   
          </div>

          {/* Right Side - Dashboard Mockup */}
          <div className="relative h-96 flex items-center justify-center">
            {/* Glow effect behind dashboard */}
            <div className="absolute inset-0 bg-green-400/20 rounded-full blur-3xl -z-10" />

            {/* Dashboard Mockup */}
            <div className="relative w-full h-96 rounded-2xl bg-white shadow-2xl p-6 overflow-hidden">
              {/* Top bar */}
              <div className="flex gap-2 mb-6 pb-4 border-b border-gray-100">
                <div className="w-3 h-3 rounded-full bg-gray-200" />
                <div className="w-3 h-3 rounded-full bg-gray-200" />
                <div className="w-3 h-3 rounded-full bg-gray-200" />
              </div>

              {/* Calendar Grid */}
              <div className="space-y-3">
                {/* Week header */}
                <div className="grid grid-cols-7 gap-2 mb-2">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                    <div
                      key={day}
                      className="text-center text-xs font-medium text-gray-400"
                    >
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar cells */}
                <div className="grid grid-cols-7 gap-2">
                  {[...Array(28)].map((_, i) => (
                    <div
                      key={i}
                      className={`aspect-square rounded-lg border text-xs flex items-center justify-center font-medium ${i === 10 || i === 15 || i === 21
                          ? 'bg-black text-white border-black'
                          : i % 5 === 0
                            ? 'bg-gray-50 border-gray-200 text-gray-400'
                            : 'border-gray-100 text-gray-300'
                        }`}
                    >
                      {i + 1}
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating cards indicator */}
              <div className="absolute bottom-4 right-4 space-y-2">
                <div className="w-20 h-10 bg-gray-100 rounded-lg" />
                <div className="w-20 h-10 bg-gray-100 rounded-lg opacity-70" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
