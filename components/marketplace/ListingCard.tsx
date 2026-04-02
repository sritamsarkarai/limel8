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

  const isDigital = listing.type === "digital";

  const cardGlow = isDigital
    ? "border-cyan-500/[0.27] shadow-[0_0_0_1px_rgba(34,211,238,0.13),0_0_20px_rgba(34,211,238,0.13),0_0_40px_rgba(34,211,238,0.05)] hover:border-cyan-500/[0.4] hover:shadow-[0_0_0_1px_rgba(34,211,238,0.27),0_0_20px_rgba(34,211,238,0.16),0_0_40px_rgba(34,211,238,0.06)]"
    : "border-violet-400/[0.27] shadow-[0_0_0_1px_rgba(167,139,250,0.13),0_0_20px_rgba(167,139,250,0.13),0_0_40px_rgba(167,139,250,0.05)] hover:border-violet-400/[0.4] hover:shadow-[0_0_0_1px_rgba(167,139,250,0.27),0_0_20px_rgba(167,139,250,0.16),0_0_40px_rgba(167,139,250,0.06)]";

  const priceColor = isDigital ? "text-cyan-400" : "text-violet-400";

  const badgeClass = isDigital
    ? "bg-cyan-950 text-cyan-400 border-cyan-500/25"
    : "bg-violet-950/60 text-violet-400 border-violet-400/25";

  return (
    <Link
      href={`/listings/${listing.id}`}
      className={`block rounded-xl border bg-zinc-800 overflow-hidden hover:-translate-y-0.5 transition-all duration-200 cursor-pointer ${cardGlow}`}
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
          <span className={`text-base font-bold ${priceColor}`}>${priceDisplay}</span>
          <span className={`text-xs px-2 py-0.5 rounded-full font-semibold border ${badgeClass}`}>
            {isDigital ? "Digital" : "Physical"}
          </span>
        </div>
      </div>
    </Link>
  );
}
