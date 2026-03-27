import "server-only";
import { db } from "@/lib/db";

export async function getFeedForUser(profileId: string, cursor?: string) {
  const follows = await db.follow.findMany({ where: { followerId: profileId } });
  const profileIds = follows.filter(f => f.followedProfileId).map(f => f.followedProfileId!);
  const groupIds = follows.filter(f => f.followedGroupId).map(f => f.followedGroupId!);

  return db.post.findMany({
    where: { OR: [{ profileId: { in: profileIds } }, { groupId: { in: groupIds } }] },
    orderBy: { createdAt: "desc" },
    take: 20,
    ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
    include: { profile: true, group: true },
  });
}
