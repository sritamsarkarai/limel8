import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getProfileByUserId } from "@/modules/profiles/queries";
import { getBookingById } from "@/modules/organizations/queries";
import { updateBookingStatus } from "@/modules/organizations/mutations";
import { BookingStatus } from "@prisma/client";
import { createMessage } from "@/modules/messaging/mutations";

export const dynamic = "force-dynamic";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const profile = await getProfileByUserId(session.user.id);
  if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

  const booking = await getBookingById(id);
  if (!booking) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await req.json();
  const { status } = body as { status: BookingStatus };

  const isOwner = booking.org.ownerId === profile.id;
  const isCustomer = booking.customerId === profile.id;

  if (status === "confirmed" || status === "declined") {
    if (!isOwner) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  } else if (status === "cancelled") {
    if (!isCustomer && !isOwner) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  } else {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const updated = await updateBookingStatus(id, status);

  const messageContent =
    status === "confirmed"
      ? `Your booking for "${booking.service.name}" has been confirmed! Requested date: ${booking.requestedDate}`
      : status === "declined"
      ? `Your booking request for "${booking.service.name}" was declined.`
      : `Booking for "${booking.service.name}" has been cancelled.`;

  if (status === "confirmed" || status === "declined") {
    await createMessage({
      senderId: profile.id,
      recipientId: booking.customerId,
      content: messageContent,
    });
  }

  return NextResponse.json(updated);
}
