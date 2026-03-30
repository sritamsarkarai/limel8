import "server-only";
import { db } from "@/lib/db";

export async function getListing(id: string) {
  return db.listing.findUnique({ where: { id }, include: { seller: true } });
}

export async function getListings(cursor?: string) {
  return db.listing.findMany({
    where: { status: "active" },
    orderBy: { createdAt: "desc" },
    take: 24,
    ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
    include: { seller: true },
  });
}

export async function getOrdersForBuyer(buyerId: string) {
  return db.order.findMany({ where: { buyerId }, include: { listing: true }, orderBy: { createdAt: "desc" } });
}

export async function getOrdersForSeller(sellerId: string) {
  return db.order.findMany({ where: { sellerId }, include: { listing: true, buyer: true }, orderBy: { createdAt: "desc" } });
}
