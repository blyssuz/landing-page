'use client';

import { useEffect, useRef, useState } from 'react';

interface AnimatedCounterProps {
  target: string;
  label: string;
  isHero?: boolean;
}

export function AnimatedCounter({ target, label, isHero = false }: AnimatedCounterProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  if (isHero) {
    return (
      <div ref={ref} className="text-center">
        <div
          className={`text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-500 transition-opacity duration-1000 ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {target}
        </div>
        <p className="text-gray-600 mt-4 text-lg">
          {label}
        </p>
      </div>
    );
  }

  return (
    <div ref={ref} className="text-center">
      <div
        className={`text-3xl md:text-4xl font-bold transition-opacity duration-1000 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {target}
      </div>
      <p className="text-gray-600 mt-2 text-sm">
        {label}
      </p>
    </div>
  );
}
