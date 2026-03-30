import "server-only";
import { db } from "@/lib/db";
import { getDownloadUrl } from "@/lib/cloudinary";
import { sendOrderConfirmation, sendDownloadLink, sendSellerNewOrder } from "@/lib/resend";
import Stripe from "stripe";

export async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  const orderId = paymentIntent.metadata?.orderId;
  if (!orderId) return;

  const order = await db.order.findUnique({
    where: { id: orderId },
    include: {
      listing: true,
      buyer: { include: { user: true } },
      seller: { include: { user: true } },
    },
  });
  if (!order || order.status !== "pending") return;

  if (order.listing.type === "physical") {
    try {
      await db.$transaction(async (tx) => {
        const [listing] = await tx.$queryRaw<Array<{
          id: string;
          stockQuantity: number | null;
          status: string;
        }>>`SELECT id, "stockQuantity", status FROM "Listing" WHERE id = ${order.listingId} FOR UPDATE`;
        if (!listing || (listing.stockQuantity !== null && listing.stockQuantity <= 0)) {
          throw new Error("Out of stock");
        }
        const newQty = listing.stockQuantity !== null ? listing.stockQuantity - 1 : null;
        await tx.listing.update({
          where: { id: order.listingId },
          data: { stockQuantity: newQty, ...(newQty === 0 ? { status: "sold" } : {}) },
        });
        await tx.order.update({ where: { id: orderId }, data: { status: "paid", stripePaymentIntentId: paymentIntent.id } });
      });
    } catch (e) {
      console.error("Out of stock — manual refund required for order", orderId, e);
      return;
    }
    // Confirmation emails for physical orders
    try {
      if (order.buyer.user.email) await sendOrderConfirmation(order.buyer.user.email, orderId);
      if (order.seller.user.email) await sendSellerNewOrder(order.seller.user.email, orderId);
    } catch (emailErr) {
      console.error("Email send failed for order", orderId, emailErr);
    }
  } else {
    // Digital — auto-complete
    await db.order.update({ where: { id: orderId }, data: { status: "complete", stripePaymentIntentId: paymentIntent.id } });
    try {
      if (order.listing.cloudinaryDownloadId && order.buyer.user.email) {
        const url = getDownloadUrl(order.listing.cloudinaryDownloadId);
        await sendDownloadLink(order.buyer.user.email, url);
      }
      // Also send order confirmation for digital
      if (order.buyer.user.email) await sendOrderConfirmation(order.buyer.user.email, orderId);
      if (order.seller.user.email) await sendSellerNewOrder(order.seller.user.email, orderId);
    } catch (emailErr) {
      console.error("Email send failed for order", orderId, emailErr);
    }
  }
}
