import { Skeleton } from '@/app/components/ui/Skeleton';

export default function RateLoading() {
  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-3xl shadow-lg px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center flex flex-col items-center">
          <Skeleton variant="text" className="h-9 w-48" />
          <Skeleton variant="text" className="h-5 w-32 mt-1" />
          <Skeleton variant="text" className="h-6 w-56 mt-3" />
        </div>

        {/* Service cards */}
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="rounded-2xl border border-stone-100 bg-stone-50 p-5">
              <div className="mb-4">
                <Skeleton variant="text" className="h-6 w-36" />
              </div>
              <div className="flex justify-center gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Skeleton key={s} variant="circular" className="!w-8 !h-8" />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Comment */}
        <div className="mt-6">
          <Skeleton variant="text" className="h-5 w-24 mb-2" />
          <Skeleton variant="rectangular" className="h-[84px] w-full !rounded-2xl" />
        </div>

        {/* Submit button */}
        <Skeleton variant="rectangular" className="mt-6 h-[52px] w-full !rounded-2xl" />
      </div>
    </div>
  );
}
