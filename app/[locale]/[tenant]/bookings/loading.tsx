export default function BookingsLoading() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-900 animate-pulse">
      {/* Header skeleton */}
      <div className="sticky top-0 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-lg z-30 border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-6 w-40 bg-zinc-200 dark:bg-zinc-800 rounded-lg" />
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 pb-24">
        {/* User info skeleton */}
        <div className="flex items-center justify-between py-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-zinc-200 dark:bg-zinc-800" />
            <div>
              <div className="h-5 w-32 bg-zinc-200 dark:bg-zinc-800 rounded-lg mb-1.5" />
              <div className="h-4 w-24 bg-zinc-200 dark:bg-zinc-800 rounded-lg" />
            </div>
          </div>
        </div>

        {/* Booking cards skeleton */}
        <div className="flex flex-col gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-3 lg:p-4 rounded-xl border-4 border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-4 w-28 bg-zinc-200 dark:bg-zinc-800 rounded" />
                <div className="h-4 w-24 bg-zinc-200 dark:bg-zinc-800 rounded" />
              </div>
              <div className="space-y-2">
                <div className="h-4 w-3/4 bg-zinc-200 dark:bg-zinc-800 rounded" />
                <div className="h-4 w-1/2 bg-zinc-200 dark:bg-zinc-800 rounded" />
              </div>
              <div className="flex justify-between mt-3 pt-2.5 border-t border-zinc-200 dark:border-zinc-800">
                <div className="h-4 w-16 bg-zinc-200 dark:bg-zinc-800 rounded" />
                <div className="h-4 w-24 bg-zinc-200 dark:bg-zinc-800 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
