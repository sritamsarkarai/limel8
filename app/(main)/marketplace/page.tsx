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
        <h1 className="text-2xl font-bold text-gray-900">Marketplace</h1>
        <Link
          href="/marketplace/new"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          + New Listing
        </Link>
      </div>

      {listings.length === 0 ? (
        <p className="text-center text-gray-500 py-16">
          No listings yet. Be the first to list something!
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}

      {listings.length === 24 && (
        <div className="mt-8 flex justify-center">
          <Link
            href={`/marketplace?cursor=${listings[listings.length - 1].id}`}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Load more
          </Link>
        </div>
      )}
    </main>
  );
}
