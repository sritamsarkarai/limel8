import { OrgCardSkeleton } from "@/components/skeletons/OrgCardSkeleton";

export default function OrgsLoading() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="h-8 w-44 bg-zinc-800 rounded animate-pulse" />
        <div className="h-9 w-24 bg-zinc-800 rounded-lg animate-pulse" />
      </div>
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <OrgCardSkeleton key={i} loading={true} />
        ))}
      </div>
    </main>
  );
}
