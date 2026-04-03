import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getProfileByUserId } from "@/modules/profiles/queries";
import { getBookingById } from "@/modules/organizations/queries";
import { getStripe } from "@/lib/stripe";

export const dynamic = "force-dynamic";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;

  const profile = await getProfileByUserId(session.user.id);
  if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

  const booking = await getBookingById(id);
  if (!booking) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (booking.org.ownerId !== profile.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (!booking.service.price) {
    return NextResponse.json({ error: "This service is free" }, { status: 400 });
  }

  const stripe = getStripe();
  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: { name: booking.service.name },
          unit_amount: Math.round(Number(booking.service.price) * 100),
        },
        quantity: 1,
      },
    ],
    metadata: { bookingId: booking.id },
    success_url: `${process.env.NEXTAUTH_URL}/orgs/${booking.orgId}?booking=paid`,
    cancel_url: `${process.env.NEXTAUTH_URL}/orgs/${booking.orgId}`,
  });

  return NextResponse.json({ url: checkoutSession.url });
}
