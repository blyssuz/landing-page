import { HeroSkeleton } from './_components/skeletons/HeroSkeleton';
import { HeaderSkeleton } from './_components/skeletons/HeaderSkeleton';
import { TabsSkeleton } from './_components/skeletons/TabsSkeleton';
import { TeamSkeleton } from './_components/skeletons/TeamSkeleton';
import { ReviewsSkeleton } from './_components/skeletons/ReviewsSkeleton';
import { SidebarSkeleton } from './_components/skeletons/SidebarSkeleton';
import { AboutSkeleton } from './_components/skeletons/AboutSkeleton';
import { Skeleton } from '@/app/components/ui/Skeleton';

export default function TenantLoading() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <HeroSkeleton />

      {/* Tabs */}
      <TabsSkeleton />

      {/* Main content */}
      <div className="max-w-[1350px] mx-auto px-4 lg:px-6 pb-24 lg:pb-20">
        <div className="lg:grid lg:grid-cols-[1fr_380px] lg:gap-8">
          {/* Left column */}
          <div>
            {/* Business header */}
            <HeaderSkeleton />

            {/* Services heading */}
            <div className="pt-5 lg:pt-6 pb-3 lg:pb-4">
              <Skeleton variant="text" className="h-5 lg:h-7 w-24 lg:w-28" />
            </div>

            {/* Search bar */}
            <div className="mb-3 lg:mb-5">
              <Skeleton variant="rectangular" className="h-10 lg:h-12 w-full !rounded-xl lg:!rounded-2xl" />
            </div>

            {/* Service cards */}
            <div className="bg-white rounded-xl lg:rounded-2xl border border-stone-100 overflow-hidden">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className={`flex items-center justify-between px-3 lg:px-5 py-3 lg:py-4 ${
                    i > 0 ? 'border-t border-stone-100' : ''
                  }`}
                >
                  <div className="flex-1 pr-3 lg:pr-4">
                    <Skeleton variant="text" className="h-3.5 lg:h-4 w-36 lg:w-40" />
                    <Skeleton variant="text" className="h-3 lg:h-3.5 w-24 lg:w-28 mt-1.5 lg:mt-2" />
                  </div>
                  <Skeleton variant="rectangular" className="h-7 lg:h-9 w-20 lg:w-28 !rounded-full" />
                </div>
              ))}
            </div>

            {/* Team */}
            <TeamSkeleton />

            {/* Reviews */}
            <ReviewsSkeleton />
          </div>

          {/* Right sidebar (desktop) */}
          <SidebarSkeleton />
        </div>

        {/* Mobile about */}
        <AboutSkeleton />
      </div>
    </div>
  );
}
