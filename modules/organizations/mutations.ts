import "server-only";
import { db } from "@/lib/db";
import { BookingStatus, OrgCategory } from "@prisma/client";

export async function createOrg(data: {
  slug: string;
  name: string;
  category: OrgCategory;
  description?: string;
  ownerId: string;
}) {
  return db.organization.create({ data });
}

export async function updateOrg(
  id: string,
  data: {
    name?: string;
    category?: OrgCategory;
    description?: string;
    avatarUrl?: string;
    bannerUrl?: string;
  }
) {
  return db.organization.update({ where: { id }, data });
}

export async function deleteOrg(id: string) {
  return db.organization.delete({ where: { id } });
}

export async function createService(data: {
  orgId: string;
  name: string;
  description?: string;
  price?: number | null;
  duration?: string;
}) {
  return db.service.create({
    data: {
      ...data,
      price: data.price != null ? data.price : null,
    },
  });
}

export async function updateService(
  id: string,
  data: {
    name?: string;
    description?: string;
    price?: number | null;
    duration?: string;
  }
) {
  const updateData: Record<string, unknown> = {};
  if (data.name !== undefined) updateData.name = data.name;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.price !== undefined) updateData.price = data.price;
  if (data.duration !== undefined) updateData.duration = data.duration;
  return db.service.update({ where: { id }, data: updateData });
}

export async function deleteService(id: string) {
  return db.service.delete({ where: { id } });
}

export async function createBooking(data: {
  serviceId: string;
  orgId: string;
  customerId: string;
  requestedDate: string;
  message?: string;
}) {
  return db.booking.create({ data });
}

export async function updateBookingStatus(
  id: string,
  status: BookingStatus,
  extra?: { stripePaymentIntentId?: string; stripeCheckoutSessionId?: string }
) {
  return db.booking.update({ where: { id }, data: { status, ...extra } });
}
