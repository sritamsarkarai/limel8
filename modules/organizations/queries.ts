import "server-only";
import { db } from "@/lib/db";

export async function getOrgBySlug(slug: string) {
  return db.organization.findUnique({
    where: { slug },
    include: {
      owner: { select: { id: true, name: true, avatarUrl: true } },
      services: { orderBy: { createdAt: "asc" } },
    },
  });
}

export async function getOrgById(id: string) {
  return db.organization.findUnique({
    where: { id },
    include: {
      owner: { select: { id: true, name: true, avatarUrl: true } },
      services: { orderBy: { createdAt: "asc" } },
    },
  });
}

export async function getOrgsByOwner(ownerId: string) {
  return db.organization.findMany({
    where: { ownerId },
    include: { services: { select: { id: true } } },
    orderBy: { createdAt: "desc" },
  });
}

export async function getBookingsForOrg(orgId: string) {
  return db.booking.findMany({
    where: { orgId },
    include: {
      service: { select: { id: true, name: true, price: true } },
      customer: { select: { id: true, name: true, avatarUrl: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getBookingById(id: string) {
  return db.booking.findUnique({
    where: { id },
    include: {
      service: true,
      org: { select: { id: true, name: true, ownerId: true } },
      customer: { select: { id: true, name: true } },
    },
  });
}
