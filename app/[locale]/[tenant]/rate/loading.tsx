export default function RateLoading() {
  return (
    <div className="min-h-screen bg-background animate-pulse">
      <div className="mx-auto max-w-lg px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center flex flex-col items-center">
          <div className="h-7 w-48 bg-zinc-200 dark:bg-zinc-800 rounded-lg" />
          <div className="h-4 w-32 bg-zinc-200 dark:bg-zinc-800 rounded-lg mt-2" />
          <div className="h-5 w-56 bg-zinc-200 dark:bg-zinc-800 rounded-lg mt-3" />
        </div>

        {/* Service cards */}
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/50 p-5"
            >
              <div className="mb-4">
                <div className="h-5 w-36 bg-zinc-200 dark:bg-zinc-800 rounded" />
              </div>
              {/* Stars */}
              <div className="flex justify-center gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <div key={s} className="w-8 h-8 bg-zinc-200 dark:bg-zinc-800 rounded-full" />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Comment */}
        <div className="mt-6">
          <div className="h-4 w-20 bg-zinc-200 dark:bg-zinc-800 rounded mb-2" />
          <div className="h-[84px] w-full bg-zinc-100 dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-700" />
        </div>

        {/* Submit button */}
        <div className="mt-6 h-[52px] w-full bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
      </div>
    </div>
  )
}
