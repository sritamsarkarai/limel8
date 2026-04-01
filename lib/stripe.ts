import "server-only";
import Stripe from "stripe";

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2026-03-25.dahlia",
    });
  }
  return _stripe;
}

/** @deprecated Use getStripe() instead */
export const stripe = new Proxy({} as Stripe, {
  get(_target, prop) {
    return (getStripe() as any)[prop];
  },
});

export const MARKETPLACE_FEE_PERCENT = 10;
export const MARKETPLACE_FEE_THRESHOLD = 200; // USD

export function calculatePlatformFee(priceUsd: number, isSubscribed: boolean): number {
  if (isSubscribed) return 0;
  if (priceUsd <= MARKETPLACE_FEE_THRESHOLD) return 0;
  return Math.round((priceUsd * MARKETPLACE_FEE_PERCENT) / 100 * 100) / 100;
}
