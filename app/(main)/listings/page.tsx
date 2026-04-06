import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getProfileByUserId } from "@/modules/profiles/queries";
import { getListingsBySeller } from "@/modules/marketplace/queries";
import Link from "next/link";

const STATUS_STYLES: Record<string, string> = {
  active: "bg-green-950 text-green-400 border-green-500/25",
  draft: "bg-zinc-800 text-zinc-400 border-zinc-600/25",
  sold: "bg-violet-950 text-violet-400 border-violet-400/25",
};

export default async function MyListingsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const profile = await getProfileByUserId(session.user.id);
  if (!profile) redirect("/login");

  const listings = await getListingsBySeller(profile.id);

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1
          className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          My Listings
        </h1>
        <Link
          href="/marketplace/new"
          className="text-sm font-semibold bg-gradient-to-r from-cyan-500 to-violet-500 text-zinc-950 px-4 py-2 rounded-lg shadow-[0_0_12px_rgba(34,211,238,0.25)] hover:opacity-90 transition-opacity"
        >
          + New Listing
        </Link>
      </div>

      {listings.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-zinc-400 mb-4">You haven&apos;t created any listings yet.</p>
          <Link
            href="/marketplace/new"
            className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            Create your first listing →
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {listings.map((listing) => (
            <div
              key={listing.id}
              className="flex items-center justify-between gap-4 rounded-xl border border-cyan-500/[0.27] bg-zinc-900 px-4 py-3 shadow-[0_0_0_1px_rgba(34,211,238,0.13),0_0_12px_rgba(34,211,238,0.08)]"
            >
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-white truncate">{listing.title}</p>
                <p className="text-xs text-zinc-500 capitalize">{listing.type} · ${listing.price.toString()}</p>
              </div>
              <span
                className={`shrink-0 text-xs px-2.5 py-1 rounded-full font-medium border ${STATUS_STYLES[listing.status] ?? STATUS_STYLES.draft}`}
              >
                {listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}
              </span>
              <Link
                href={`/listings/${listing.id}`}
                className="shrink-0 text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                View →
              </Link>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
