import { Skeleton } from '@/app/components/ui/Skeleton';

export function HeroSkeleton() {
  return (
    <>
      {/* Desktop mosaic skeleton */}
      <div className="hidden lg:block max-w-[1350px] mx-auto px-6 pt-4">
        <div className="h-[460px] rounded-2xl overflow-hidden grid grid-cols-4 grid-rows-2 gap-1.5">
          <Skeleton variant="rectangular" className="col-span-2 row-span-2 !rounded-l-2xl !rounded-r-none h-full" />
          <Skeleton variant="rectangular" className="!rounded-none h-full" />
          <Skeleton variant="rectangular" className="!rounded-none !rounded-tr-2xl h-full" />
          <Skeleton variant="rectangular" className="!rounded-none h-full" />
          <Skeleton variant="rectangular" className="!rounded-none !rounded-br-2xl h-full" />
        </div>
      </div>

      {/* Mobile carousel skeleton */}
      <div className="lg:hidden">
        <Skeleton variant="rectangular" className="!rounded-none h-[300px] w-full" />
      </div>
    </>
  );
}
