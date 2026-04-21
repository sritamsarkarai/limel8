ALTER TABLE "User" ADD COLUMN "emailVerificationToken" TEXT UNIQUE;
ALTER TABLE "User" ADD COLUMN "emailVerificationExpiry" TIMESTAMP(3);
