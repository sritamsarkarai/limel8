import "server-only";
import { db } from "@/lib/db";

export async function getProfileById(prefixedId: string) {
  if (prefixedId.startsWith("p_")) {
    const id = prefixedId.slice(2);
    const data = await db.profile.findUnique({
      where: { id },
      include: {
        groupsAdmin: true,
        groupMemberships: { include: { group: true } },
        listings: { where: { status: "active" } },
        posts: { orderBy: { createdAt: 'desc' }, take: 20 },
      },
    });
    return data ? { type: "profile" as const, data } : null;
  }
  if (prefixedId.startsWith("g_")) {
    const id = prefixedId.slice(2);
    const data = await db.group.findUnique({
      where: { id },
      include: {
        admin: true,
        members: { include: { profile: true } },
        posts: { orderBy: { createdAt: "desc" }, take: 20 },
      },
    });
    return data ? { type: "group" as const, data } : null;
  }
  return null;
}

export async function getProfileByUserId(userId: string) {
  return db.profile.findUnique({ where: { userId } });
}
