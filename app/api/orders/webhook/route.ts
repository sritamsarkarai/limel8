import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { handlePaymentIntentSucceeded } from "@/modules/marketplace/webhook";
import { db } from "@/lib/db";
import Stripe from "stripe";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");
  if (!sig) return NextResponse.json({ error: "Missing signature" }, { status: 400 });

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const checkoutSession = event.data.object as Stripe.Checkout.Session;
    // Find the order by looking up the payment intent
    const paymentIntentId = typeof checkoutSession.payment_intent === "string"
      ? checkoutSession.payment_intent
      : checkoutSession.payment_intent?.id;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const shippingDetails = (checkoutSession as any).shipping_details;
    if (paymentIntentId && shippingDetails) {
      await db.order.updateMany({
        where: { stripePaymentIntentId: paymentIntentId },
        data: { shippingAddress: shippingDetails },
      });
    }
  }

  if (event.type === "payment_intent.succeeded") {
    await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent);
  }

  return NextResponse.json({ received: true });
}
