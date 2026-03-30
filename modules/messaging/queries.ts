import "server-only";
import { db } from "@/lib/db";

export async function getConversations(profileId: string) {
  const messages = await db.message.findMany({
    where: { OR: [{ senderId: profileId }, { recipientId: profileId }] },
    orderBy: { createdAt: "desc" },
    take: 200, // get enough to deduplicate
    include: { sender: true, recipient: true },
  });

  // Deduplicate: keep latest message per conversation partner
  const seen = new Map<string, typeof messages[0]>();
  for (const msg of messages) {
    const partnerId = msg.senderId === profileId ? msg.recipientId : msg.senderId;
    if (!seen.has(partnerId)) {
      seen.set(partnerId, msg);
    }
  }
  return Array.from(seen.values());
}

export async function getMessages(profileId: string, otherProfileId: string) {
  return db.message.findMany({
    where: {
      OR: [
        { senderId: profileId, recipientId: otherProfileId },
        { senderId: otherProfileId, recipientId: profileId },
      ],
    },
    orderBy: { createdAt: "asc" },
    include: { sender: true },
  });
}
