import { Skeleton } from '@/app/components/ui/Skeleton';

export function HeaderSkeleton() {
  return (
    <div className="pt-4 lg:pt-8 pb-3 lg:pb-4 border-b border-stone-100">
      <div className="flex items-start gap-2.5 lg:gap-3">
        <Skeleton variant="circular" width={40} height={40} className="lg:!w-12 lg:!h-12 flex-shrink-0" />
        <div className="flex-1">
          <Skeleton variant="text" className="h-5 lg:h-7 w-44 lg:w-72" />
          <Skeleton variant="text" className="h-3 lg:h-4 w-32 lg:w-40 mt-1.5" />
          <div className="flex gap-2 lg:gap-3 mt-2 lg:mt-3">
            <Skeleton variant="text" className="h-3.5 lg:h-4 w-28 lg:w-32" />
            <Skeleton variant="text" className="h-3.5 lg:h-4 w-20 lg:w-24" />
            <Skeleton variant="text" className="h-3.5 lg:h-4 w-14 lg:w-16" />
          </div>
        </div>
      </div>
    </div>
  );
}
