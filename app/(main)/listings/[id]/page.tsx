import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getListing } from "@/modules/marketplace/queries";
import { getProfileByUserId } from "@/modules/profiles/queries";
import { BuyButton } from "@/components/marketplace/BuyButton";
import { ConnectStripeButton } from "@/components/marketplace/ConnectStripeButton";
import { ListingOwnerActions } from "@/components/marketplace/ListingOwnerActions";

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

  const isOwner = viewerProfile?.id === listing.sellerId;
  const priceDisplay = listing.price.toString();
  const isSellerWithNoBankAccount =
    isOwner &&
    listing.status === "draft" &&
    !listing.seller.stripeAccountId;

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-4 flex items-center justify-between">
        <Link href="/marketplace" className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors">
          &larr; Back to Marketplace
        </Link>
        {isOwner && (
          <ListingOwnerActions
            listingId={listing.id}
            initialTitle={listing.title}
            initialDescription={listing.description}
            initialPrice={priceDisplay}
            initialLocation={listing.location ?? ""}
            initialStockQuantity={listing.stockQuantity ?? undefined}
            listingType={listing.type}
            listingStatus={listing.status}
          />
        )}
      </div>

      {listing.previewMediaUrls.length > 0 && (
        <div className="mb-6 grid gap-2 sm:grid-cols-2">
          {listing.previewMediaUrls.map((url: string, i: number) => (
            <div key={i} className="relative aspect-square w-full bg-zinc-700 rounded-lg overflow-hidden border border-cyan-500/[0.27] shadow-[0_0_0_1px_rgba(34,211,238,0.13),0_0_12px_rgba(34,211,238,0.08)]">
              <Image src={url} alt={`${listing.title} preview ${i + 1}`} fill className="object-cover" />
            </div>
          ))}
        </div>
      )}

      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-2xl font-bold text-white">{listing.title}</h1>
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

        <div className="flex items-center gap-2 text-sm text-zinc-400">
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

        {listing.location && (
          <div className="flex items-center gap-1.5 text-sm text-zinc-400">
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
            </svg>
            {listing.location}
          </div>
        )}

        <p className="text-zinc-300 whitespace-pre-wrap leading-relaxed">{listing.description}</p>

        {listing.type === "digital" && (
          <p className="text-sm text-cyan-400 font-medium">Digital download — delivered instantly</p>
        )}

        {listing.type === "physical" && listing.stockQuantity != null && (
          <p className="text-sm text-zinc-400">
            {listing.stockQuantity > 0
              ? `${listing.stockQuantity} in stock`
              : "Out of stock"}
          </p>
        )}

        {listing.status === "active" && !isOwner && (
          <BuyButton listingId={listing.id} />
        )}

        {listing.status === "sold" && (
          <p className="text-sm font-medium text-zinc-500">This listing has been sold.</p>
        )}

        {listing.status === "draft" && (
          isSellerWithNoBankAccount ? (
            <ConnectStripeButton />
          ) : isOwner ? (
            <p className="text-sm font-medium text-zinc-500">This listing is a draft — not yet published.</p>
          ) : (
            <p className="text-sm font-medium text-zinc-500">This listing is not yet published.</p>
          )
        )}
      </div>
    </main>
  );
}
