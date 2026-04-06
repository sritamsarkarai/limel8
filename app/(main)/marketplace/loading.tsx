import { ListingCardSkeleton } from "@/components/skeletons/ListingCardSkeleton";

export default function MarketplaceLoading() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 h-8 w-40 bg-zinc-800 rounded animate-pulse" />
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <ListingCardSkeleton key={i} loading={true} />
        ))}
      </div>
    </main>
  );
}
