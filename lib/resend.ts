import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.RESEND_FROM_EMAIL!;

export async function sendOrderConfirmation(to: string, orderId: string) {
  await resend.emails.send({ from: FROM, to, subject: "Order confirmed — ArtistConnect", html: `<p>Your order <strong>${orderId}</strong> has been placed.</p>` });
}

export async function sendDownloadLink(to: string, downloadUrl: string) {
  await resend.emails.send({ from: FROM, to, subject: "Your download is ready — ArtistConnect", html: `<p><a href="${downloadUrl}">Click here to download your file</a> (link expires in 1 hour).</p>` });
}

export async function sendSellerNewOrder(to: string, orderId: string) {
  await resend.emails.send({ from: FROM, to, subject: "You have a new order — ArtistConnect", html: `<p>Order <strong>${orderId}</strong> has been placed for one of your listings.</p>` });
}

export async function sendShippingNotification(to: string, orderId: string) {
  await resend.emails.send({ from: FROM, to, subject: "Your order has shipped — ArtistConnect", html: `<p>Order <strong>${orderId}</strong> has been marked as shipped.</p>` });
}

export async function sendMessageNotification(to: string, senderName: string) {
  await resend.emails.send({ from: FROM, to, subject: `New message from ${senderName} — ArtistConnect`, html: `<p>You have a new message from <strong>${senderName}</strong>. Log in to reply.</p>` });
}
