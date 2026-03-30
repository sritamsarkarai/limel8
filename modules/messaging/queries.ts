import "server-only";
import { db } from "@/lib/db";

export async function getConversations(profileId: string) {
  // Get the latest message per conversation partner
  return db.message.findMany({
    where: { OR: [{ senderId: profileId }, { recipientId: profileId }] },
    orderBy: { createdAt: "desc" },
    distinct: ["senderId", "recipientId"],
    include: { sender: true, recipient: true },
  });
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
