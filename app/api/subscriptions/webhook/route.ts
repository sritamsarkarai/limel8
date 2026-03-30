import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import Stripe from "stripe";

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");
  if (!sig) return NextResponse.json({ error: "Missing signature" }, { status: 400 });

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_BILLING_WEBHOOK_SECRET!);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const subscription = event.data.object as Stripe.Subscription;
  const customerId = typeof subscription.customer === "string" ? subscription.customer : subscription.customer.id;
  const profile = await db.profile.findFirst({ where: { stripeCustomerId: customerId } });
  if (!profile) return NextResponse.json({ received: true });

  try {
    if (event.type === "customer.subscription.created" || event.type === "customer.subscription.updated") {
      const isActive = subscription.status === "active";
      const priceId = subscription.items.data[0]?.price.id;
      const tier = priceId === process.env.STRIPE_MONTHLY_PRICE_ID ? "monthly" : "annual";
      await db.profile.update({
        where: { id: profile.id },
        data: {
          subscriptionStatus: isActive ? "active" : "free",
          subscriptionTier: isActive ? tier : null,
        },
      });
    }

    if (event.type === "customer.subscription.deleted") {
      await db.profile.update({
        where: { id: profile.id },
        data: { subscriptionStatus: "free", subscriptionTier: null },
      });
    }
  } catch (e) {
    console.error("Subscription webhook DB update failed:", e);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
