import "server-only";
import { db } from "@/lib/db";

export async function createPost(data: { profileId?: string; groupId?: string; content: string; mediaUrls?: string[] }) {
  return db.post.create({ data, include: { profile: true, group: true } });
}

export async function deletePost(postId: string, requestorProfileId: string) {
  const post = await db.post.findUnique({ where: { id: postId } });
  if (!post) throw new Error("Post not found");

  if (post.profileId !== null) {
    // Individual profile post — must be own post
    if (post.profileId !== requestorProfileId) throw new Error("Unauthorized");
  } else if (post.groupId !== null) {
    // Group post — must be group admin
    const group = await db.group.findUnique({ where: { id: post.groupId }, select: { adminId: true } });
    if (!group || group.adminId !== requestorProfileId) throw new Error("Unauthorized");
  }

  return db.post.delete({ where: { id: postId } });
}

export async function follow(followerId: string, target: { profileId?: string; groupId?: string }) {
  return db.follow.create({
    data: { followerId, followedProfileId: target.profileId ?? null, followedGroupId: target.groupId ?? null },
  });
}

export async function unfollow(followerId: string, target: { profileId?: string; groupId?: string }) {
  const result = await db.follow.deleteMany({
    where: { followerId, followedProfileId: target.profileId ?? null, followedGroupId: target.groupId ?? null },
  });
  if (result.count === 0) throw new Error("Follow not found");
  return result;
}
