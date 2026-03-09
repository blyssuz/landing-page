import { Skeleton } from '@/app/components/ui/Skeleton';

export default function TenantLoading() {
  return (
    <div className="min-h-screen max-w-3xl mx-auto">
      {/* Profile Header skeleton */}
      <div className="px-4 pt-4 pb-2">
        {/* Language toggle */}
        <div className="flex justify-between items-center mb-6">
          <div />
          <Skeleton variant="rectangular" className="h-9 w-24 !rounded-full" />
        </div>

        {/* Name — matches text-3xl */}
        <Skeleton variant="text" className="h-10 w-56" />

        {/* Tagline — matches text-base */}
        <Skeleton variant="text" className="h-5 w-40 mt-1" />

        {/* Status row: dot + status + stars + reviews + distance */}
        <div className="flex items-center gap-1.5 mt-2">
          <Skeleton variant="circular" className="!w-3 !h-3" />
          <Skeleton variant="text" className="h-5 w-44" />
          <span className="text-stone-200">&middot;</span>
          <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} variant="rectangular" className="!w-4 !h-4 !rounded-sm" />
            ))}
          </div>
          <Skeleton variant="text" className="h-5 w-12" />
          <span className="text-stone-200">&middot;</span>
          <Skeleton variant="text" className="h-5 w-20" />
        </div>
      </div>

      {/* Main content */}
      <div className="px-4 pb-24">
        {/* Services section */}
        <div className="pt-6">
          {/* Title — matches text-2xl font-bold */}
          <Skeleton variant="text" className="h-7 w-28 mb-4" />

          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className={`flex items-center justify-between py-4 ${i > 0 ? 'border-t border-stone-100' : ''}`}>
              <div className="flex-1 pr-4">
                <Skeleton variant="text" className="h-5 w-40" />
                <Skeleton variant="text" className="h-4 w-20 mt-1" />
              </div>
              <div className="flex flex-col items-end gap-1.5">
                <Skeleton variant="text" className="h-5 w-24" />
                <Skeleton variant="rectangular" className="h-9 w-28 !rounded-full" />
              </div>
            </div>
          ))}
        </div>

        {/* Team section */}
        <div className="mt-8">
          <Skeleton variant="text" className="h-7 w-36 mb-3" />
          <div className="flex gap-3 overflow-hidden">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center flex-shrink-0">
                <Skeleton variant="circular" className="!w-14 !h-14" />
                <Skeleton variant="text" className="h-4 w-16 mt-2" />
              </div>
            ))}
          </div>
        </div>

        {/* Reviews section */}
        <div className="mt-8">
          <Skeleton variant="text" className="h-7 w-28 mb-2" />

          {/* Rating summary */}
          <div className="flex items-center gap-1.5 mb-5">
            <Skeleton variant="text" className="h-5 w-20" />
          </div>

          {/* Review cards */}
          <div className="divide-y divide-stone-100">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="py-4 first:pt-0">
                <div className="flex items-center gap-2.5 mb-2">
                  <Skeleton variant="circular" className="!w-10 !h-10" />
                  <div>
                    <Skeleton variant="text" className="h-5 w-28" />
                    <Skeleton variant="text" className="h-4 w-36 mt-0.5" />
                  </div>
                </div>
                <div className="flex gap-0.5 mb-2">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Skeleton key={j} variant="rectangular" className="!w-[18px] !h-[18px] !rounded-sm" />
                  ))}
                </div>
                <Skeleton variant="text" className="h-5 w-full" />
                <Skeleton variant="text" className="h-5 w-2/3 mt-1" />
              </div>
            ))}
          </div>
        </div>

        {/* Location map section */}
        <div className="mt-8">
          <Skeleton variant="text" className="h-7 w-24 mb-4" />
          <Skeleton variant="rectangular" className="w-full aspect-[16/9] !rounded-2xl" />
          <div className="mt-3 px-1">
            <Skeleton variant="text" className="h-5 w-52" />
            <Skeleton variant="text" className="h-5 w-28 mt-1.5" />
          </div>
        </div>
      </div>
    </div>
  );
}
