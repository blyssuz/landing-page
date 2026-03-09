import { Skeleton } from '@/app/components/ui/Skeleton';

export default function BookingLoading() {
  return (
    <div className="min-h-screen bg-white max-w-3xl mx-auto shadow-lg px-4">
      {/* Header skeleton */}
      <div className="sticky top-0 bg-white/80 backdrop-blur-lg z-30 border-b border-stone-100">
        <div className="py-3 flex items-center gap-3">
          <Skeleton variant="circular" className="!w-9 !h-9" />
          <div>
            <Skeleton variant="text" className="h-6 w-40" />
            <Skeleton variant="text" className="h-5 w-28 mt-1" />
          </div>
        </div>
      </div>

      {/* Calendar section skeleton */}
      <div className="pt-6">
        <div className="flex items-center justify-between mb-3">
          <Skeleton variant="text" className="h-7 w-44" />
          <div className="flex gap-1">
            <Skeleton variant="circular" className="!w-11 !h-11" />
            <Skeleton variant="circular" className="!w-11 !h-11" />
          </div>
        </div>
        {/* Date pills */}
        <div className="flex gap-2 py-2 overflow-hidden">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex-shrink-0 flex flex-col items-center w-[4.5rem] py-5 rounded-2xl bg-stone-50">
              <Skeleton variant="text" className="h-4 w-10" />
              <Skeleton variant="text" className="h-6 w-6 mt-0.5" />
            </div>
          ))}
        </div>
      </div>

      {/* Time slots skeleton */}
      <div className="pt-8">
        <Skeleton variant="text" className="h-7 w-40 mb-3" />
        {/* Time tabs */}
        <div className="flex gap-2 mb-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} variant="rectangular" className="flex-1 h-10 !rounded-xl" />
          ))}
        </div>
        {/* Slots grid */}
        <div className="grid grid-cols-4 gap-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} variant="rectangular" className="h-12 !rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
