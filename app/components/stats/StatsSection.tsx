import { stats } from '@/data/stats';
import { AnimatedCounter } from './AnimatedCounter';

export function StatsSection() {
  const heroStat = stats[0];
  const otherStats = stats.slice(1);

  return (
    <div className="max-w-6xl mx-auto px-6 py-20 text-center">
      <h2 className="text-3xl md:text-4xl font-bold mb-4">
        The top-rated destination for selfcare
      </h2>

      <p className="text-gray-600 mb-12 text-lg">
        Discover amazing beauty professionals and book your appointments with ease
      </p>

      <div className="mb-16">
        <AnimatedCounter
          target={heroStat.value}
          label={heroStat.label}
          isHero
        />
      </div>

      <div className="flex flex-col md:flex-row justify-center gap-8 md:gap-16">
        {otherStats.map((stat) => (
          <AnimatedCounter
            key={stat.label}
            target={stat.value}
            label={stat.label}
          />
        ))}
      </div>
    </div>
  );
}
