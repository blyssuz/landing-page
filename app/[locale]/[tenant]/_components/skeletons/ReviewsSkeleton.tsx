import { Skeleton } from '@/app/components/ui/Skeleton';

export function ReviewsSkeleton() {
  return (
    <div className="mt-6 lg:mt-10">
      <Skeleton variant="text" className="h-5 lg:h-7 w-24 lg:w-28 mb-3 lg:mb-4" />

      {/* Aggregate rating skeleton */}
      <div className="flex items-center gap-4 lg:gap-6 p-4 lg:p-5 bg-stone-50 rounded-xl lg:rounded-2xl mb-4 lg:mb-5">
        <div className="flex flex-col items-center gap-1">
          <Skeleton variant="text" className="h-10 lg:h-12 w-12 lg:w-14" />
          <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} variant="rectangular" className="h-3 w-3 !rounded-sm" />
            ))}
          </div>
          <Skeleton variant="text" className="h-3 w-16 mt-0.5" />
        </div>
        <div className="flex-1 space-y-1.5">
          {[5, 4, 3, 2, 1].map((star) => (
            <div key={star} className="flex items-center gap-2">
              <Skeleton variant="text" className="h-3 w-3" />
              <Skeleton variant="rectangular" className="flex-1 h-2 !rounded-full" />
            </div>
          ))}
        </div>
      </div>

      {/* Review card skeletons */}
      <div className="space-y-2 lg:space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl lg:rounded-2xl p-3.5 lg:p-5 border border-stone-100">
            <div className="flex items-center gap-2.5 lg:gap-3 mb-2.5 lg:mb-3">
              <Skeleton variant="circular" width={32} height={32} className="lg:!w-10 lg:!h-10" />
              <div className="flex-1">
                <Skeleton variant="text" className="h-3.5 lg:h-4 w-28 lg:w-36" />
                <Skeleton variant="text" className="h-3 w-16 lg:w-20 mt-1" />
              </div>
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Skeleton key={j} variant="rectangular" className="h-3 w-3 !rounded-sm" />
                ))}
              </div>
            </div>
            <Skeleton variant="text" className="h-3 lg:h-3.5 w-full" />
            <Skeleton variant="text" className="h-3 lg:h-3.5 w-3/4 mt-1" />
          </div>
        ))}
      </div>
    </div>
  );
}
