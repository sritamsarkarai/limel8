import "server-only";
import { db } from "@/lib/db";
import { AvailabilityStatus } from "@prisma/client";

export async function updateProfile(
  profileId: string,
  data: {
    name?: string;
    bio?: string;
    artistType?: string;
    location?: string;
    availabilityStatus?: AvailabilityStatus;
    avatarUrl?: string;
    bannerUrl?: string;
    instagramUrl?: string;
    facebookUrl?: string;
    spotifyUrl?: string;
    soundcloudUrl?: string;
    youtubeUrl?: string;
    websiteUrl?: string;
  }
) {
  return db.profile.update({ where: { id: profileId }, data });
}

export async function createGroup(
  adminProfileId: string,
  data: { name: string; description?: string }
) {
  return db.group.create({
    data: {
      ...data,
      adminId: adminProfileId,
      members: { create: { profileId: adminProfileId } },
    },
  });
}

export async function addGroupMember(groupId: string, profileId: string) {
  return db.groupMember.create({ data: { groupId, profileId } });
}

export async function removeGroupMember(groupId: string, profileId: string) {
  return db.groupMember.delete({
    where: { profileId_groupId: { profileId, groupId } },
  });
}
