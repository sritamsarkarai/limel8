import { getListings } from "@/modules/marketplace/queries";
import { ListingCard } from "@/components/marketplace/ListingCard";

export default async function ListingsPage() {
  const listings = await getListings();

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent mb-6" style={{ fontFamily: "var(--font-heading)" }}>
        Marketplace
      </h1>

      {listings.length === 0 ? (
        <div className="py-16 text-center relative">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div style={{ background: "radial-gradient(ellipse at center, rgba(34,211,238,0.06) 0%, transparent 60%)", width: 400, height: 400 }} />
          </div>
          <p className="relative text-zinc-400">No listings yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}
    </main>
  );
}
