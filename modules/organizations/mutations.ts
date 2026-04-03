import "server-only";
import { db } from "@/lib/db";
import { BookingStatus, OrgCategory } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/client";

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
      price: data.price != null ? new Decimal(data.price) : null,
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
  return db.service.update({
    where: { id },
    data: {
      ...data,
      price: data.price != null ? new Decimal(data.price) : null,
    },
  });
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
