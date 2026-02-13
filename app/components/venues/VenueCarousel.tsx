'use client';

import { useRef, useState, useImperativeHandle, forwardRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface VenueCarouselHandle {
  scrollLeft: () => void;
  scrollRight: () => void;
  showLeftButton: boolean;
  showRightButton: boolean;
}

interface VenueCarouselProps {
  children: React.ReactNode;
  onScrollChange?: (state: { showLeft: boolean; showRight: boolean }) => void;
}

export const VenueCarousel = forwardRef<VenueCarouselHandle, VenueCarouselProps>(
  ({ children, onScrollChange }, ref) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [showLeftButton, setShowLeftButton] = useState(false);
    const [showRightButton, setShowRightButton] = useState(true);

    const handleScroll = () => {
      if (scrollContainerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } =
          scrollContainerRef.current;

        const left = scrollLeft > 0;
        const right = scrollLeft < scrollWidth - clientWidth - 10;
        setShowLeftButton(left);
        setShowRightButton(right);
        onScrollChange?.({ showLeft: left, showRight: right });
      }
    };

    const scroll = (direction: 'left' | 'right') => {
      if (scrollContainerRef.current) {
        const scrollAmount = 320;
        scrollContainerRef.current.scrollBy({
          left: direction === 'left' ? -scrollAmount : scrollAmount,
          behavior: 'smooth',
        });
      }
    };

    useImperativeHandle(ref, () => ({
      scrollLeft: () => scroll('left'),
      scrollRight: () => scroll('right'),
      showLeftButton,
      showRightButton,
    }));

    return (
      <div className="relative">
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="overflow-x-auto scroll-smooth scrollbar-hide"
          style={{ scrollBehavior: 'smooth' }}
        >
          <div className="flex gap-4 pb-2">
            {children}
          </div>
        </div>
      </div>
    );
  }
);

VenueCarousel.displayName = 'VenueCarousel';
