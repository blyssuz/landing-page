'use client';

import { motion } from 'motion/react';
import { springs } from '@/lib/animations';

interface Tab {
  id: string;
  label: string;
  ref: React.RefObject<HTMLElement | null>;
  count?: number;
}

interface TabNavigationProps {
  tabs: Tab[];
  activeTab: string;
  onTabClick: (id: string) => void;
}

export function TabNavigation({ tabs, activeTab, onTabClick }: TabNavigationProps) {
  return (
    <div className="sticky top-0 z-30 bg-white border-b border-stone-200 shadow-warm-sm">
      <div className="max-w-[1350px] mx-auto px-4 lg:px-6">
        <nav className="flex gap-1 overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                tab.ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                onTabClick(tab.id);
              }}
              className={`relative px-3.5 lg:px-5 py-2.5 lg:py-3.5 text-[13px] lg:text-[15px] whitespace-nowrap transition-colors duration-200 ${
                activeTab === tab.id
                  ? 'text-stone-900 font-semibold'
                  : 'text-stone-500 font-medium hover:text-stone-700'
              }`}
            >
              {tab.label}
              {tab.count !== undefined && tab.count > 0 && (
                <span className="ml-1.5 text-xs bg-stone-100 text-stone-500 px-1.5 py-0.5 rounded-full">
                  {tab.count}
                </span>
              )}
              {activeTab === tab.id && (
                <motion.span
                  layoutId="activeTabIndicator"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary rounded-full"
                  transition={springs.snappy}
                />
              )}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}
