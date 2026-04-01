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
  const priceDisplay =
    typeof listing.price === "object"
      ? listing.price.toString()
      : listing.price.toFixed(2);

  return (
    <Link
      href={`/listings/${listing.id}`}
      className="block rounded-xl border border-zinc-700 bg-zinc-800 overflow-hidden hover:-translate-y-0.5 hover:border-cyan-500/50 transition-all duration-200 cursor-pointer"
    >
      <div className="aspect-square w-full bg-zinc-700 relative">
        {previewImage ? (
          <Image
            src={previewImage}
            alt={listing.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-zinc-500 text-sm">
            No preview
          </div>
        )}
      </div>
      <div className="p-3">
        <h3 className="font-semibold text-white truncate">{listing.title}</h3>
        <p className="text-sm text-zinc-500 truncate mt-0.5">{listing.seller.name}</p>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-base font-bold text-cyan-400">${priceDisplay}</span>
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-semibold border ${
              listing.type === "digital"
                ? "bg-cyan-950 text-cyan-400 border-cyan-500/25"
                : "bg-green-950 text-green-400 border-green-500/25"
            }`}
          >
            {listing.type === "digital" ? "Digital" : "Physical"}
          </span>
        </div>
      </div>
    </Link>
  );
}
