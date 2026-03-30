import "server-only";
import { db } from "@/lib/db";
import { sendMessageNotification } from "@/lib/resend";

export async function sendMessage(senderId: string, recipientId: string, content: string) {
  const message = await db.message.create({
    data: { senderId, recipientId, content },
    include: { sender: true, recipient: { include: { user: true } } },
  });
  // Send email notification (fire-and-forget; don't let email failure break message sending)
  try {
    if (message.recipient.user.email) {
      await sendMessageNotification(message.recipient.user.email, message.sender.name);
    }
  } catch (e) {
    console.error("Message notification email failed:", e);
  }
  return message;
}

export async function markThreadRead(profileId: string, otherProfileId: string) {
  return db.message.updateMany({
    where: { senderId: otherProfileId, recipientId: profileId, read: false },
    data: { read: true },
  });
}
