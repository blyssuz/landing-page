export default function TenantLoading() {
  return (
    <div className="min-h-screen bg-zinc-50/50 dark:bg-zinc-950 animate-pulse">
      {/* Photo mosaic skeleton */}
      <div className="hidden lg:block max-w-[1350px] mx-auto px-6 pt-4">
        <div className="h-[460px] rounded-2xl overflow-hidden grid grid-cols-4 grid-rows-2 gap-1.5">
          <div className="col-span-2 row-span-2 bg-zinc-200 dark:bg-zinc-800 rounded-l-2xl" />
          <div className="bg-zinc-200 dark:bg-zinc-800" />
          <div className="bg-zinc-200 dark:bg-zinc-800 rounded-tr-2xl" />
          <div className="bg-zinc-200 dark:bg-zinc-800" />
          <div className="bg-zinc-200 dark:bg-zinc-800 rounded-br-2xl" />
        </div>
      </div>
      {/* Mobile carousel skeleton */}
      <div className="lg:hidden h-[280px] bg-zinc-200 dark:bg-zinc-800" />

      {/* Sticky tab nav skeleton */}
      <div className="sticky top-0 z-30 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 shadow-[0_1px_3px_0_rgb(0_0_0/0.04)]">
        <div className="max-w-[1350px] mx-auto px-4 lg:px-6 flex gap-4 py-3.5">
          {[80, 100, 72, 64].map((w, i) => (
            <div key={i} className="h-5 rounded bg-zinc-200 dark:bg-zinc-800" style={{ width: w }} />
          ))}
        </div>
      </div>

      <div className="max-w-[1350px] mx-auto px-4 lg:px-6 pb-24 lg:pb-20">
        <div className="lg:grid lg:grid-cols-[1fr_380px] lg:gap-8">
          {/* Left column */}
          <div>
            {/* Business name + metadata */}
            <div className="pt-6 lg:pt-8 pb-4 border-b border-zinc-100 dark:border-zinc-800/50">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-full bg-zinc-200 dark:bg-zinc-800 flex-shrink-0" />
                <div className="flex-1">
                  <div className="h-7 lg:h-8 w-56 lg:w-72 bg-zinc-200 dark:bg-zinc-800 rounded-lg" />
                  <div className="flex gap-3 mt-3">
                    <div className="h-4 w-32 bg-zinc-200 dark:bg-zinc-800 rounded" />
                    <div className="h-4 w-24 bg-zinc-200 dark:bg-zinc-800 rounded" />
                    <div className="h-4 w-16 bg-zinc-200 dark:bg-zinc-800 rounded" />
                  </div>
                </div>
              </div>
            </div>

            {/* Services heading */}
            <div className="pt-6 pb-4">
              <div className="h-6 lg:h-7 w-28 bg-zinc-200 dark:bg-zinc-800 rounded-lg" />
            </div>

            {/* Search bar */}
            <div className="mb-5">
              <div className="h-12 w-full bg-zinc-50 dark:bg-zinc-800/60 rounded-2xl border border-transparent" />
            </div>

            {/* Service cards */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 overflow-hidden">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className={`flex items-center justify-between px-4 lg:px-5 py-4 ${i > 1 ? 'border-t border-zinc-100 dark:border-zinc-800' : ''}`}>
                  <div className="flex-1 pr-4">
                    <div className="h-4 w-40 bg-zinc-200 dark:bg-zinc-800 rounded" />
                    <div className="h-3.5 w-28 bg-zinc-100 dark:bg-zinc-800/60 rounded mt-2" />
                  </div>
                  <div className="h-9 w-28 rounded-full border-2 border-zinc-200 dark:border-zinc-700" />
                </div>
              ))}
            </div>
          </div>

          {/* Right sidebar (desktop) */}
          <div className="hidden lg:block">
            <div className="sticky top-16 space-y-4 pt-6">
              {/* Book Now CTA */}
              <div className="h-12 w-full bg-zinc-200 dark:bg-zinc-800 rounded-2xl" />

              {/* Map */}
              <div className="bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-100 dark:border-zinc-800">
                <div className="aspect-[16/10] bg-zinc-200 dark:bg-zinc-800" />
                <div className="p-4">
                  <div className="h-5 w-36 bg-zinc-200 dark:bg-zinc-800 rounded" />
                  <div className="h-3.5 w-48 bg-zinc-100 dark:bg-zinc-800/60 rounded mt-1.5" />
                  <div className="h-4 w-20 bg-zinc-200 dark:bg-zinc-800 rounded mt-2" />
                </div>
              </div>

              {/* Working hours */}
              <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-4">
                <div className="h-5 w-28 bg-zinc-200 dark:bg-zinc-800 rounded mb-3" />
                <div className="space-y-1">
                  {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                    <div key={i} className="flex justify-between py-2 px-3">
                      <div className="h-4 w-24 bg-zinc-100 dark:bg-zinc-800/60 rounded" />
                      <div className="h-4 w-28 bg-zinc-100 dark:bg-zinc-800/60 rounded" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact */}
              <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-4">
                <div className="h-5 w-24 bg-zinc-200 dark:bg-zinc-800 rounded mb-3" />
                <div className="flex items-center justify-between">
                  <div className="h-4 w-32 bg-zinc-100 dark:bg-zinc-800/60 rounded" />
                  <div className="h-8 w-24 rounded-lg border border-zinc-200 dark:border-zinc-700" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
