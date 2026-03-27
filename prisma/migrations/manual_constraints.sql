-- Manual constraints to apply via raw migration after running `prisma migrate deploy`.
-- These cannot be expressed in Prisma schema SDL and must be applied separately.

-- ─── Post: enforce exactly one of profileId / groupId is non-null ───────────
ALTER TABLE "Post" ADD CONSTRAINT post_author_check
  CHECK (("profileId" IS NOT NULL)::int + ("groupId" IS NOT NULL)::int = 1);

-- ─── Follow: enforce exactly one of followedProfileId / followedGroupId is non-null ───
ALTER TABLE "Follow" ADD CONSTRAINT follow_target_check
  CHECK (("followedProfileId" IS NOT NULL)::int + ("followedGroupId" IS NOT NULL)::int = 1);

-- ─── Follow: partial unique indexes (NULL-safe uniqueness) ──────────────────
-- The @@unique([followerId, followedProfileId, followedGroupId]) in Prisma does NOT
-- prevent duplicate follows in PostgreSQL because NULL != NULL in UNIQUE constraints.
CREATE UNIQUE INDEX follow_profile_unique
  ON "Follow"("followerId", "followedProfileId")
  WHERE "followedProfileId" IS NOT NULL;

CREATE UNIQUE INDEX follow_group_unique
  ON "Follow"("followerId", "followedGroupId")
  WHERE "followedGroupId" IS NOT NULL;
