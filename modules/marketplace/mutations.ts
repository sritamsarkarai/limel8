import "server-only";
import { db } from "@/lib/db";
import { ListingType } from "@prisma/client";

export async function createListing(sellerId: string, data: {
  title: string; description: string; price: number; type: ListingType;
  previewMediaUrls?: string[]; cloudinaryDownloadId?: string; stockQuantity?: number; location?: string;
}) {
  return db.listing.create({ data: { sellerId, ...data } });
}

export async function publishListing(listingId: string, sellerId: string) {
  const seller = await db.profile.findUnique({ where: { id: sellerId } });
  if (!seller?.stripeAccountId) {
    throw new Error("Stripe Connect onboarding required before publishing a listing");
  }
  return db.listing.update({ where: { id: listingId, sellerId, status: "draft" }, data: { status: "active" } });
}

export async function updateListing(listingId: string, data: Partial<{ title: string; description: string; price: number; previewMediaUrls: string[]; stockQuantity: number; location: string }>) {
  return db.listing.update({ where: { id: listingId, status: { in: ["draft", "active"] } }, data });
}

export async function deleteListing(listingId: string, sellerId: string) {
  const listing = await db.listing.findUnique({ where: { id: listingId } });
  if (!listing) throw new Error("Listing not found");
  if (listing.sellerId !== sellerId) throw new Error("Unauthorized");
  return db.listing.delete({ where: { id: listingId } });
}
