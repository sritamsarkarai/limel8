import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { stripe, calculatePlatformFee } from "@/lib/stripe";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { listingId } = await req.json();
    if (!listingId) return NextResponse.json({ error: "listingId required" }, { status: 400 });

    const listing = await db.listing.findUnique({ where: { id: listingId }, include: { seller: true } });
    if (!listing || listing.status !== "active") {
      return NextResponse.json({ error: "Listing not available" }, { status: 400 });
    }

    if (listing.type === "physical" && listing.stockQuantity !== null && listing.stockQuantity <= 0) {
      return NextResponse.json({ error: "This item is out of stock" }, { status: 400 });
    }

    const buyerProfile = await db.profile.findUnique({ where: { userId: session.user.id } });
    if (!buyerProfile) return NextResponse.json({ error: "Profile not found" }, { status: 400 });

    if (buyerProfile.id === listing.sellerId) {
      return NextResponse.json({ error: "Cannot purchase your own listing" }, { status: 400 });
    }

    const isSubscribed = listing.seller.subscriptionStatus === "active";
    const priceUsd = Number(listing.price);
    const platformFee = calculatePlatformFee(priceUsd, isSubscribed);
    const sellerPayout = priceUsd - platformFee;

    const order = await db.order.create({
      data: {
        buyerId: buyerProfile.id,
        sellerId: listing.sellerId,
        listingId: listing.id,
        amount: priceUsd,
        platformFee,
        sellerPayout,
        status: "pending",
      },
    });

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_intent_data: {
        application_fee_amount: Math.round(platformFee * 100),
        transfer_data: { destination: listing.seller.stripeAccountId! },
        metadata: { orderId: order.id },
      },
      line_items: [{
        price_data: {
          currency: "usd",
          unit_amount: Math.round(priceUsd * 100),
          product_data: { name: listing.title },
        },
        quantity: 1,
      }],
      ...(listing.type === "physical" ? { shipping_address_collection: { allowed_countries: ["US", "CA", "GB"] } } : {}),
      success_url: `${process.env.NEXTAUTH_URL}/orders/${order.id}?success=1`,
      cancel_url: `${process.env.NEXTAUTH_URL}/listings/${listingId}`,
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (e: unknown) {
    console.error(e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
