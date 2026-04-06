import { ProfileCardSkeleton } from "@/components/skeletons/ProfileCardSkeleton";

export default function SearchLoading() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6 h-8 w-40 bg-zinc-800 rounded animate-pulse" />
      {/* Filter bar placeholder */}
      <div className="flex gap-3 mb-8 flex-wrap">
        <div className="h-9 flex-1 min-w-48 bg-zinc-800 rounded-lg animate-pulse" />
        <div className="h-9 w-24 bg-zinc-800 rounded-lg animate-pulse" />
      </div>
      <div className="flex gap-3 mb-6 flex-wrap">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-9 w-36 bg-zinc-800 rounded-lg animate-pulse" />
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <ProfileCardSkeleton key={i} loading={true} />
        ))}
      </div>
    </main>
  );
}
