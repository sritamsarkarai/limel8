import { getListings } from "@/modules/marketplace/queries";
import { ListingCard } from "@/components/marketplace/ListingCard";
import Link from "next/link";

export default async function MarketplacePage({
  searchParams,
}: {
  searchParams: Promise<{ cursor?: string }>;
}) {
  const { cursor } = await searchParams;
  const listings = await getListings(cursor);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent" style={{ fontFamily: "var(--font-heading)" }}>
          Marketplace
        </h1>
        <Link
          href="/marketplace/new"
          className="rounded-lg bg-gradient-to-r from-cyan-400 to-violet-400 px-4 py-2 text-sm font-bold text-zinc-950 shadow-[0_0_20px_rgba(34,211,238,0.2),0_4px_12px_rgba(34,211,238,0.13)] hover:opacity-90 transition-opacity"
        >
          + New Listing
        </Link>
      </div>

      {listings.length === 0 ? (
        <div className="py-16 text-center relative">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div style={{ background: "radial-gradient(ellipse at center, rgba(34,211,238,0.06) 0%, transparent 60%)", width: 400, height: 400 }} />
          </div>
          <p className="relative text-zinc-400">No listings yet. Be the first to list something!</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {listings.map((listing: (typeof listings)[number]) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}

      {listings.length === 24 && (
        <div className="mt-8 flex justify-center">
          <Link
            href={`/marketplace?cursor=${listings[listings.length - 1].id}`}
            className="rounded-lg border border-cyan-500/[0.27] px-4 py-2 text-sm font-medium text-zinc-300 hover:text-white hover:border-cyan-500/[0.4] shadow-[0_0_0_1px_rgba(34,211,238,0.13)] transition-all"
          >
            Load more
          </Link>
        </div>
      )}
    </main>
  );
}
