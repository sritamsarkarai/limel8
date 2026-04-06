import "server-only";
import { db } from "@/lib/db";

// Public-facing — omits sensitive download ID
export async function getListing(id: string) {
  return db.listing.findUnique({
    where: { id },
    omit: { cloudinaryDownloadId: true },
    include: { seller: true },
  });
}

export async function getListings({ cursor, q, location }: { cursor?: string; q?: string; location?: string } = {}) {
  return db.listing.findMany({
    where: {
      status: "active",
      ...(q ? { title: { contains: q, mode: "insensitive" } } : {}),
      ...(location ? { location: { contains: location, mode: "insensitive" } } : {}),
    },
    orderBy: { createdAt: "desc" },
    take: 24,
    ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
    omit: { cloudinaryDownloadId: true },
    include: { seller: true },
  });
}

// Internal use only — includes download ID (for webhook/download route in Task 9)
export async function getListingWithDownloadId(id: string) {
  return db.listing.findUnique({ where: { id }, include: { seller: true } });
}

export async function getListingsBySeller(sellerId: string) {
  return db.listing.findMany({
    where: { sellerId },
    orderBy: { createdAt: "desc" },
    omit: { cloudinaryDownloadId: true },
    include: { seller: true },
  });
}

export async function getOrdersForBuyer(buyerId: string) {
  return db.order.findMany({ where: { buyerId }, include: { listing: true }, orderBy: { createdAt: "desc" } });
}

export async function getOrdersForSeller(sellerId: string) {
  return db.order.findMany({ where: { sellerId }, include: { listing: true, buyer: true }, orderBy: { createdAt: "desc" } });
}
