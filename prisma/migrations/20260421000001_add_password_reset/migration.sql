ALTER TABLE "User" ADD COLUMN "passwordResetToken" TEXT UNIQUE;
ALTER TABLE "User" ADD COLUMN "passwordResetExpiry" TIMESTAMP(3);
