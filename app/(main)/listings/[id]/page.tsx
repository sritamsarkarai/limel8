import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getListing } from "@/modules/marketplace/queries";
import { getProfileByUserId } from "@/modules/profiles/queries";
import { BuyButton } from "@/components/marketplace/BuyButton";
import { ConnectStripeButton } from "@/components/marketplace/ConnectStripeButton";

export default async function ListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const listing = await getListing(id);
  const session = await getServerSession(authOptions);
  const viewerProfile = session?.user?.id ? await getProfileByUserId(session.user.id) : null;

  if (!listing) return notFound();

  const priceDisplay = listing.price.toString();
  const isSellerWithNoBankAccount =
    viewerProfile?.id === listing.sellerId &&
    listing.status === "draft" &&
    !listing.seller.stripeAccountId;

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-4">
        <Link href="/marketplace" className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors">
          &larr; Back to Marketplace
        </Link>
      </div>

      {listing.previewMediaUrls.length > 0 && (
        <div className="mb-6 grid gap-2 sm:grid-cols-2">
          {listing.previewMediaUrls.map((url: string, i: number) => (
            <div key={i} className="relative aspect-square w-full bg-gray-100 rounded-lg overflow-hidden border border-cyan-500/[0.27] shadow-[0_0_0_1px_rgba(34,211,238,0.13),0_0_12px_rgba(34,211,238,0.08)]">
              <Image src={url} alt={`${listing.title} preview ${i + 1}`} fill className="object-cover" />
            </div>
          ))}
        </div>
      )}

      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-2xl font-bold text-gray-900">{listing.title}</h1>
          <span
            className={`shrink-0 text-sm px-2.5 py-1 rounded-full font-medium border ${
              listing.type === "digital"
                ? "bg-cyan-950 text-cyan-400 border-cyan-500/25 shadow-[0_0_8px_rgba(34,211,238,0.2)]"
                : "bg-violet-950/60 text-violet-400 border-violet-400/25 shadow-[0_0_8px_rgba(167,139,250,0.2)]"
            }`}
          >
            {listing.type === "digital" ? "Digital" : "Physical"}
          </span>
        </div>

        <p className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">${priceDisplay}</p>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          {listing.seller.avatarUrl && (
            <Image
              src={listing.seller.avatarUrl}
              alt={listing.seller.name}
              width={24}
              height={24}
              className="rounded-full border border-cyan-500/40"
            />
          )}
          <span>Sold by <strong>{listing.seller.name}</strong></span>
        </div>

        <p className="text-gray-700 whitespace-pre-wrap">{listing.description}</p>

        {listing.type === "digital" && (
          <p className="text-sm text-blue-600 font-medium">Digital download — delivered instantly</p>
        )}

        {listing.type === "physical" && listing.stockQuantity != null && (
          <p className="text-sm text-gray-600">
            {listing.stockQuantity > 0
              ? `${listing.stockQuantity} in stock`
              : "Out of stock"}
          </p>
        )}

        {listing.status === "active" && (
          <BuyButton listingId={listing.id} />
        )}

        {listing.status === "sold" && (
          <p className="text-sm font-medium text-gray-500">This listing has been sold.</p>
        )}

        {listing.status === "draft" && (
          isSellerWithNoBankAccount ? (
            <ConnectStripeButton />
          ) : (
            <p className="text-sm font-medium text-gray-500">This listing is not yet published.</p>
          )
        )}
      </div>
    </main>
  );
}
