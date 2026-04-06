import { PostCardSkeleton } from "@/components/skeletons/PostCardSkeleton";

export default function FeedLoading() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-6 h-8 w-32 bg-zinc-800 rounded animate-pulse" />
      <div className="flex flex-col gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <PostCardSkeleton key={i} loading={true} />
        ))}
      </div>
    </main>
  );
}
