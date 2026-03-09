import { Skeleton } from '@/app/components/ui/Skeleton';
import { TeamSkeleton } from './_components/skeletons/TeamSkeleton';
import { ReviewsSkeleton } from './_components/skeletons/ReviewsSkeleton';
import { AboutSkeleton } from './_components/skeletons/AboutSkeleton';

export default function TenantLoading() {
  return (
    <div className="min-h-screen bg-white">
      {/* Profile Header skeleton */}
      <div className="px-4 pt-4 pb-2">
        {/* Language toggle placeholder */}
        <div className="flex justify-between items-center mb-6">
          <Skeleton variant="rectangular" className="h-8 w-20 !rounded-full" />
          <div />
        </div>

        {/* Avatar */}
        <div className="flex justify-center">
          <Skeleton variant="circular" className="w-[88px] h-[88px]" />
        </div>

        {/* Name */}
        <div className="flex justify-center mt-4">
          <Skeleton variant="text" className="h-7 w-48" />
        </div>

        {/* Tagline */}
        <div className="flex justify-center mt-2">
          <Skeleton variant="text" className="h-4 w-32" />
        </div>

        {/* Status row */}
        <div className="flex justify-center mt-3">
          <Skeleton variant="text" className="h-4 w-56" />
        </div>

        {/* Book button */}
        <div className="mt-5">
          <Skeleton variant="rectangular" className="h-12 w-full !rounded-xl" />
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-3 gap-3 mt-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} variant="rectangular" className="h-16 !rounded-xl" />
          ))}
        </div>
      </div>

      {/* Photo strip skeleton */}
      <div className="px-4 py-3">
        <div className="flex gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} variant="rectangular" className="w-14 h-14 flex-shrink-0 !rounded-lg" />
          ))}
        </div>
      </div>

      {/* Services skeleton */}
      <div className="px-4 pt-6">
        <Skeleton variant="text" className="h-6 w-24 mb-4" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className={`flex items-center justify-between py-4 ${i > 0 ? 'border-t border-stone-100' : ''}`}>
            <div className="flex-1 pr-4">
              <Skeleton variant="text" className="h-4 w-36" />
              <Skeleton variant="text" className="h-3 w-20 mt-1.5" />
              <Skeleton variant="text" className="h-3 w-24 mt-1.5" />
            </div>
            <Skeleton variant="rectangular" className="h-8 w-24 !rounded-full" />
          </div>
        ))}
      </div>

      {/* Remaining sections */}
      <div className="px-4">
        <TeamSkeleton />
        <ReviewsSkeleton />
        <AboutSkeleton />
      </div>
    </div>
  );
}
