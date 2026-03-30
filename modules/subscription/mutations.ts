import "server-only";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";

export async function createSubscriptionCheckout(profileId: string, tier: "monthly" | "annual", userEmail: string) {
  const priceId = tier === "monthly"
    ? process.env.STRIPE_MONTHLY_PRICE_ID!
    : process.env.STRIPE_ANNUAL_PRICE_ID!;

  const profile = await db.profile.findUnique({ where: { id: profileId } });
  let customerId = profile?.stripeCustomerId;

  if (!customerId) {
    const customer = await stripe.customers.create({ email: userEmail, metadata: { profileId } });
    customerId = customer.id;
    await db.profile.update({ where: { id: profileId }, data: { stripeCustomerId: customerId } });
  }

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.NEXTAUTH_URL}/settings/subscription?success=1`,
    cancel_url: `${process.env.NEXTAUTH_URL}/settings/subscription`,
  });

  return session.url;
}

export async function cancelSubscription(profileId: string) {
  const profile = await db.profile.findUnique({ where: { id: profileId } });
  if (!profile?.stripeCustomerId) throw new Error("No active subscription");

  // List active subscriptions for this customer
  const subscriptions = await stripe.subscriptions.list({
    customer: profile.stripeCustomerId,
    status: "active",
    limit: 1,
  });

  if (subscriptions.data.length === 0) throw new Error("No active subscription found");

  // Cancel at period end (not immediately)
  await stripe.subscriptions.update(subscriptions.data[0].id, { cancel_at_period_end: true });
}
