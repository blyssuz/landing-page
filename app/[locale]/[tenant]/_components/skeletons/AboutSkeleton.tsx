import { Skeleton } from '@/app/components/ui/Skeleton';

export function AboutSkeleton() {
  return (
    <div className="lg:hidden mt-6 space-y-3">
      {/* Map card skeleton */}
      <div className="bg-white rounded-xl overflow-hidden border border-stone-100">
        <Skeleton variant="rectangular" className="aspect-[16/9] !rounded-none w-full" />
        <div className="p-3.5">
          <Skeleton variant="text" className="h-4 w-32" />
          <Skeleton variant="text" className="h-3 w-44 mt-1" />
        </div>
      </div>

      {/* Call button skeleton */}
      <Skeleton variant="rectangular" className="h-10 w-full !rounded-xl" />

      {/* Working hours card skeleton */}
      <div className="bg-white rounded-xl border border-stone-100 p-3.5">
        <Skeleton variant="text" className="h-4 w-24" />
      </div>
    </div>
  );
}
