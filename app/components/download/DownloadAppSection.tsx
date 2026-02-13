import React from 'react';
import { Smartphone, Apple, Play } from 'lucide-react';

export const DownloadAppSection: React.FC = () => {
  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <div className="flex flex-col justify-center">
          {/* Badge */}
          <div className="flex items-center gap-2 mb-6">
            <Smartphone className="w-4 h-4 text-gray-700" />
            <span className="text-sm font-medium text-gray-700">
              Available on iOS & Android
            </span>
          </div>

          {/* Heading */}
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Download the Blyss app
          </h2>

          {/* Subtitle */}
          <p className="text-gray-600 mb-8 leading-relaxed">
            Get instant access to book appointments, manage your schedule, and
            connect with your favorite services wherever you are. Download Blyss
            today and experience seamless booking on the go.
          </p>

          {/* Download Buttons */}
          <div className="flex gap-4 flex-wrap">
            <button className="px-6 py-3 bg-black text-white rounded-full font-medium hover:bg-gray-900 transition-colors flex items-center gap-2">
              <Apple className="w-5 h-5" />
              App Store
            </button>
            <button className="px-6 py-3 bg-black text-white rounded-full font-medium hover:bg-gray-900 transition-colors flex items-center gap-2">
              <Play className="w-5 h-5" />
              Google Play
            </button>
          </div>
        </div>

        {/* Right Side - Phone Mockups */}
        <div className="relative h-96 md:h-auto flex items-center justify-center">
          {/* First Phone */}
          <div
            className="absolute w-48 h-96 rounded-3xl bg-gradient-to-br from-gray-100 to-gray-200 border border-gray-200 shadow-xl"
            style={{
              left: 0,
              zIndex: 10,
            }}
          >
            <div className="w-full h-full rounded-3xl flex items-center justify-center text-gray-400 text-sm font-medium">
              iPhone mockup
            </div>
          </div>

          {/* Second Phone - Overlapped and Rotated */}
          <div
            className="absolute w-48 h-96 rounded-3xl bg-gradient-to-br from-white to-gray-100 border border-gray-300 shadow-2xl"
            style={{
              left: '120px',
              transform: 'rotate(6deg)',
              zIndex: 20,
            }}
          >
            <div className="w-full h-full rounded-3xl flex items-center justify-center text-gray-400 text-sm font-medium">
              Android mockup
            </div>
          </div>

          {/* Glow effect behind phones */}
          <div className="absolute w-96 h-96 bg-blue-300/10 rounded-full blur-3xl -z-10" />
        </div>
      </div>
    </section>
  );
};
