import { PostCardSkeleton } from "@/components/skeletons/PostCardSkeleton";

export default function ProfileLoading() {
  return (
    <div className="max-w-2xl mx-auto">
      {/* Banner */}
      <div className="h-40 w-full bg-zinc-800 animate-pulse" />
      {/* Avatar + info */}
      <div className="px-4 pb-4">
        <div className="flex items-end gap-4 -mt-10 mb-4">
          <div className="w-20 h-20 rounded-full bg-zinc-800 border-4 border-zinc-950 shrink-0 animate-pulse" />
          <div className="flex-1 pb-1 space-y-2">
            <div className="h-5 w-40 bg-zinc-800 rounded animate-pulse" />
            <div className="h-3 w-28 bg-zinc-800 rounded animate-pulse" />
          </div>
        </div>
        {/* Bio */}
        <div className="space-y-2 mb-6">
          <div className="h-3 w-full bg-zinc-800 rounded animate-pulse" />
          <div className="h-3 w-3/4 bg-zinc-800 rounded animate-pulse" />
        </div>
        {/* Posts */}
        <div className="flex flex-col gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <PostCardSkeleton key={i} loading={true} />
          ))}
        </div>
      </div>
    </div>
  );
}
