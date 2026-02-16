export default function LocationLoading() {
  return (
    <div className="fixed inset-0 bg-zinc-100 dark:bg-zinc-900 animate-pulse">
      {/* Header skeleton */}
      <div className="h-[60px] bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 flex items-center gap-3 px-4">
        <div className="w-9 h-9 rounded-full bg-zinc-200 dark:bg-zinc-800" />
        <div>
          <div className="h-5 w-32 bg-zinc-200 dark:bg-zinc-800 rounded" />
          <div className="h-3 w-48 bg-zinc-200 dark:bg-zinc-800 rounded mt-1" />
        </div>
      </div>
      {/* Map area skeleton */}
      <div className="w-full bg-zinc-200 dark:bg-zinc-800" style={{ height: 'calc(100vh - 132px)' }} />
    </div>
  )
}
