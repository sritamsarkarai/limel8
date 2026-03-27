import "server-only";
import { db } from "@/lib/db";

export async function createPost(data: { profileId?: string; groupId?: string; content: string; mediaUrls?: string[] }) {
  return db.post.create({ data, include: { profile: true, group: true } });
}

export async function deletePost(postId: string, requestorProfileId: string) {
  const post = await db.post.findUnique({ where: { id: postId } });
  if (!post) throw new Error("Post not found");
  if (post.profileId !== requestorProfileId) throw new Error("Unauthorized");
  return db.post.delete({ where: { id: postId } });
}

export async function follow(followerId: string, target: { profileId?: string; groupId?: string }) {
  return db.follow.create({
    data: { followerId, followedProfileId: target.profileId ?? null, followedGroupId: target.groupId ?? null },
  });
}

export async function unfollow(followerId: string, target: { profileId?: string; groupId?: string }) {
  return db.follow.deleteMany({
    where: { followerId, followedProfileId: target.profileId ?? null, followedGroupId: target.groupId ?? null },
  });
}
