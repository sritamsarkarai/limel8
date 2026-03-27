import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-03-25.dahlia",
});

export const MARKETPLACE_FEE_PERCENT = 10;
export const MARKETPLACE_FEE_THRESHOLD = 200; // USD

export function calculatePlatformFee(priceUsd: number, isSubscribed: boolean): number {
  if (isSubscribed) return 0;
  if (priceUsd <= MARKETPLACE_FEE_THRESHOLD) return 0;
  return Math.round((priceUsd * MARKETPLACE_FEE_PERCENT) / 100 * 100) / 100;
}
