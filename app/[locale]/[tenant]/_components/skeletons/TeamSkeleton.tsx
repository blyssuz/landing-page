import { Skeleton } from '@/app/components/ui/Skeleton';

export function TeamSkeleton() {
  return (
    <div className="mt-6 lg:mt-10">
      <Skeleton variant="text" className="h-5 lg:h-7 w-28 lg:w-36 mb-3 lg:mb-4" />
      <div className="flex gap-2.5 lg:gap-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex flex-col items-center flex-shrink-0 w-[120px] lg:w-[160px] p-3 lg:p-4">
            <Skeleton variant="circular" width={48} height={48} className="lg:!w-20 lg:!h-20" />
            <Skeleton variant="text" className="h-3 lg:h-4 w-16 lg:w-24 mt-2 lg:mt-3" />
            <Skeleton variant="text" className="h-2.5 lg:h-3 w-12 lg:w-16 mt-1" />
          </div>
        ))}
      </div>
    </div>
  );
}
