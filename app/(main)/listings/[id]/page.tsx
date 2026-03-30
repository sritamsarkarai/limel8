import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getListing } from "@/modules/marketplace/queries";
import { BuyButton } from "@/components/marketplace/BuyButton";

export default async function ListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const listing = await getListing(id);

  if (!listing) return notFound();

  const priceDisplay = listing.price.toString();

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-4">
        <Link href="/marketplace" className="text-sm text-blue-600 hover:underline">
          &larr; Back to Marketplace
        </Link>
      </div>

      {listing.previewMediaUrls.length > 0 && (
        <div className="mb-6 grid gap-2 sm:grid-cols-2">
          {listing.previewMediaUrls.map((url, i) => (
            <div key={i} className="relative aspect-square w-full bg-gray-100 rounded-lg overflow-hidden">
              <Image src={url} alt={`${listing.title} preview ${i + 1}`} fill className="object-cover" />
            </div>
          ))}
        </div>
      )}

      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-2xl font-bold text-gray-900">{listing.title}</h1>
          <span
            className={`shrink-0 text-sm px-2.5 py-1 rounded-full font-medium ${
              listing.type === "digital"
                ? "bg-blue-100 text-blue-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {listing.type === "digital" ? "Digital" : "Physical"}
          </span>
        </div>

        <p className="text-3xl font-bold text-gray-900">${priceDisplay}</p>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          {listing.seller.avatarUrl && (
            <Image
              src={listing.seller.avatarUrl}
              alt={listing.seller.name}
              width={24}
              height={24}
              className="rounded-full"
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
          <p className="text-sm font-medium text-gray-500">This listing is not yet published.</p>
        )}
      </div>
    </main>
  );
}
