export default function TenantLoading() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-900 animate-pulse">
      {/* Cover skeleton */}
      <div className="h-[180px] lg:h-[300px] bg-zinc-200 dark:bg-zinc-800" />

      <div className="max-w-[1350px] mx-auto px-4 lg:px-6 pb-8">
        <div className="lg:grid lg:grid-cols-3 lg:gap-5">
          {/* Left column */}
          <div className="lg:col-span-2">
            {/* Avatar overlapping cover */}
            <div className="-mt-14 lg:-mt-16 relative z-10">
              <div className="w-28 h-28 lg:w-32 lg:h-32 rounded-full bg-zinc-300 dark:bg-zinc-700 border-[3px] border-white dark:border-zinc-900" />
            </div>

            {/* Business name + meta */}
            <div className="mt-3 mb-6">
              <div className="h-7 lg:h-9 w-56 lg:w-72 bg-zinc-200 dark:bg-zinc-800 rounded-lg" />
              <div className="h-4 w-44 bg-zinc-200 dark:bg-zinc-800 rounded-lg mt-2" />
              <div className="h-4 w-32 bg-zinc-200 dark:bg-zinc-800 rounded-lg mt-2" />
            </div>

            {/* Services title */}
            <div className="pb-4">
              <div className="h-6 lg:h-7 w-28 bg-zinc-200 dark:bg-zinc-800 rounded-lg" />
            </div>

            {/* Search bar */}
            <div className="mb-5">
              <div className="h-11 w-full bg-zinc-100 dark:bg-zinc-800 rounded-xl" />
            </div>

            {/* Service items */}
            <div className="flex flex-col gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-start justify-between pb-4 border-b border-zinc-200 dark:border-zinc-800 lg:border lg:rounded-xl lg:p-5">
                  <div className="flex-1 pr-4">
                    <div className="h-5 w-40 bg-zinc-200 dark:bg-zinc-800 rounded" />
                    <div className="h-4 w-60 bg-zinc-200 dark:bg-zinc-800 rounded mt-2" />
                    <div className="h-4 w-20 bg-zinc-200 dark:bg-zinc-800 rounded mt-3" />
                  </div>
                  <div className="text-end">
                    <div className="h-5 w-24 bg-zinc-200 dark:bg-zinc-800 rounded ml-auto" />
                    <div className="h-8 w-24 bg-zinc-200 dark:bg-zinc-800 rounded-full mt-2 ml-auto" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right sidebar (desktop only) */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="pt-6 space-y-5">
              {/* Map skeleton */}
              <div className="rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800">
                <div className="aspect-[4/3] bg-zinc-200 dark:bg-zinc-800" />
                <div className="p-3.5">
                  <div className="h-5 w-36 bg-zinc-200 dark:bg-zinc-800 rounded" />
                  <div className="h-4 w-24 bg-zinc-200 dark:bg-zinc-800 rounded mt-2" />
                </div>
              </div>

              {/* Working hours skeleton */}
              <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-4">
                <div className="h-6 w-32 bg-zinc-200 dark:bg-zinc-800 rounded mb-3" />
                <div className="space-y-2">
                  {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                    <div key={i} className="flex justify-between py-1.5 px-3">
                      <div className="h-4 w-24 bg-zinc-200 dark:bg-zinc-800 rounded" />
                      <div className="h-4 w-28 bg-zinc-200 dark:bg-zinc-800 rounded" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
