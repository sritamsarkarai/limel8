import { getListings } from "@/modules/marketplace/queries";
import { ListingCard } from "@/components/marketplace/ListingCard";

export default async function ListingsPage() {
  const listings = await getListings();

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-bold text-white mb-6">Marketplace</h1>

      {listings.length === 0 ? (
        <p className="text-zinc-400">No listings yet.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}
    </main>
  );
}
