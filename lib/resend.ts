import { Resend } from "resend";

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

function getFrom() {
  return process.env.RESEND_FROM_EMAIL ?? "noreply@artistconnect.com";
}

export async function sendOrderConfirmation(to: string, orderId: string) {
  await getResend().emails.send({ from: getFrom(), to, subject: "Order confirmed — LimeL8", html: `<p>Your order <strong>${orderId}</strong> has been placed.</p>` });
}

export async function sendDownloadLink(to: string, downloadUrl: string) {
  await getResend().emails.send({ from: getFrom(), to, subject: "Your download is ready — LimeL8", html: `<p><a href="${downloadUrl}">Click here to download your file</a> (link expires in 1 hour).</p>` });
}

export async function sendSellerNewOrder(to: string, orderId: string) {
  await getResend().emails.send({ from: getFrom(), to, subject: "You have a new order — LimeL8", html: `<p>Order <strong>${orderId}</strong> has been placed for one of your listings.</p>` });
}

export async function sendShippingNotification(to: string, orderId: string) {
  await getResend().emails.send({ from: getFrom(), to, subject: "Your order has shipped — LimeL8", html: `<p>Order <strong>${orderId}</strong> has been marked as shipped.</p>` });
}

export async function sendMessageNotification(to: string, senderName: string) {
  await getResend().emails.send({ from: getFrom(), to, subject: `New message from ${senderName} — LimeL8`, html: `<p>You have a new message from <strong>${senderName}</strong>. Log in to reply.</p>` });
}
