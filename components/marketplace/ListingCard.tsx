import Link from "next/link";
import Image from "next/image";

interface ListingCardProps {
  listing: {
    id: string;
    title: string;
    price: number | { toString(): string };
    type: "digital" | "physical";
    status: string;
    previewMediaUrls?: string[] | null;
    seller: {
      name: string;
      avatarUrl?: string | null;
    };
  };
}

export function ListingCard({ listing }: ListingCardProps) {
  const previewImage = listing.previewMediaUrls?.[0] ?? null;
  const priceDisplay = typeof listing.price === "object"
    ? listing.price.toString()
    : listing.price.toFixed(2);

  return (
    <Link
      href={`/listings/${listing.id}`}
      className="block rounded-lg border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow overflow-hidden"
    >
      <div className="aspect-square w-full bg-gray-100 relative">
        {previewImage ? (
          <Image
            src={previewImage}
            alt={listing.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-400 text-sm">
            No preview
          </div>
        )}
      </div>
      <div className="p-3">
        <h3 className="font-semibold text-gray-900 truncate">{listing.title}</h3>
        <p className="text-sm text-gray-500 truncate">{listing.seller.name}</p>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-base font-bold text-gray-900">${priceDisplay}</span>
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-medium ${
              listing.type === "digital"
                ? "bg-blue-100 text-blue-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {listing.type === "digital" ? "Digital" : "Physical"}
          </span>
        </div>
      </div>
    </Link>
  );
}
