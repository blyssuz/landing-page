import { Skeleton } from '@/app/components/ui/Skeleton';

export function SidebarSkeleton() {
  return (
    <div className="hidden lg:block">
      <div className="sticky top-16 space-y-4 pt-6">
        {/* CTA button skeleton */}
        <Skeleton variant="rectangular" className="h-12 w-full !rounded-2xl" />

        {/* Map placeholder */}
        <div className="bg-white rounded-2xl overflow-hidden border border-stone-100">
          <Skeleton variant="rectangular" className="aspect-[16/10] !rounded-none w-full" />
          <div className="p-4">
            <Skeleton variant="text" className="h-5 w-36" />
            <Skeleton variant="text" className="h-3.5 w-48 mt-1.5" />
            <Skeleton variant="text" className="h-4 w-20 mt-2" />
          </div>
        </div>

        {/* Working hours placeholder */}
        <div className="bg-white rounded-2xl border border-stone-100 p-4">
          <Skeleton variant="text" className="h-5 w-28 mb-3" />
          <div className="space-y-1">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="flex justify-between py-2 px-3">
                <Skeleton variant="text" className="h-4 w-24" />
                <Skeleton variant="text" className="h-4 w-28" />
              </div>
            ))}
          </div>
        </div>

        {/* Contact placeholder */}
        <div className="bg-white rounded-2xl border border-stone-100 p-4">
          <Skeleton variant="text" className="h-5 w-24 mb-3" />
          <div className="flex items-center justify-between">
            <Skeleton variant="text" className="h-4 w-32" />
            <Skeleton variant="rectangular" className="h-8 w-24 !rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}
