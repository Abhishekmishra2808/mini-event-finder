export const EventCardSkeleton = () => {
  return (
    <div className="bg-zinc-900 backdrop-blur-sm border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
      {/* Header Image Skeleton */}
      <div className="h-48 bg-gradient-to-r from-zinc-700/50 via-zinc-600/50 to-zinc-700/50 animate-pulse relative">
        {/* Category Badge Skeleton */}
        <div className="absolute top-4 left-4">
          <div className="h-10 w-24 bg-zinc-600/50 rounded-full animate-pulse" />
        </div>
        {/* Save Button Skeleton */}
        <div className="absolute top-4 right-4">
          <div className="h-10 w-10 bg-zinc-600/50 rounded-full animate-pulse" />
        </div>
      </div>

      <div className="p-6">
        {/* Title Skeleton - Larger */}
        <div className="h-8 bg-zinc-700/50 rounded w-4/5 mb-4 animate-pulse" />

        {/* Countdown Skeleton */}
        <div className="h-5 bg-zinc-700/50 rounded w-1/2 mb-4 animate-pulse" />

        {/* Description Skeleton */}
        <div className="space-y-2 mb-4">
          <div className="h-4 bg-zinc-700/40 rounded w-full animate-pulse" />
          <div className="h-4 bg-zinc-700/40 rounded w-5/6 animate-pulse" />
        </div>

        {/* Tags Skeleton */}
        <div className="flex gap-2 mb-4">
          <div className="h-6 bg-zinc-700/40 rounded-full w-16 animate-pulse" />
          <div className="h-6 bg-zinc-700/40 rounded-full w-20 animate-pulse" />
          <div className="h-6 bg-zinc-700/40 rounded-full w-14 animate-pulse" />
        </div>

        {/* Date and Location Skeleton */}
        <div className="space-y-2 mb-4">
          <div className="h-4 bg-zinc-700/40 rounded w-2/3 animate-pulse" />
          <div className="h-4 bg-zinc-700/40 rounded w-3/4 animate-pulse" />
        </div>

        {/* Participants Skeleton */}
        <div className="flex items-center justify-between pt-4 border-t border-zinc-700/50">
          <div className="h-4 bg-zinc-700/40 rounded w-1/3 animate-pulse" />
          <div className="h-6 bg-zinc-700/40 rounded-full w-20 animate-pulse" />
        </div>
      </div>
    </div>
  );
};
