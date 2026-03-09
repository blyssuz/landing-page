import { Skeleton } from '@/app/components/ui/Skeleton';

export function TabsSkeleton() {
  return (
    <div className="sticky top-0 z-30 bg-white border-b border-stone-200 shadow-warm-sm">
      <div className="max-w-[1350px] mx-auto px-4 lg:px-6 flex gap-3 lg:gap-4 py-3 lg:py-3.5">
        {[64, 80, 56, 52].map((w, i) => (
          <Skeleton key={i} variant="text" width={w} className="h-4 lg:h-5" />
        ))}
      </div>
    </div>
  );
}
