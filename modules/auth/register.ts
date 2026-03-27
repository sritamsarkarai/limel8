import "server-only";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

interface RegisterInput {
  email: string;
  password: string;
  name: string;
}

export async function registerUser({ email, password, name }: RegisterInput) {
  const normalisedEmail = email.toLowerCase().trim();

  if (password.length < 8) {
    throw new Error("Password must be at least 8 characters");
  }

  // Hash outside the transaction — CPU-bound, should not hold a DB connection
  const passwordHash = await bcrypt.hash(password, 12);

  return db.$transaction(async (tx) => {
    const existing = await tx.user.findUnique({ where: { email: normalisedEmail } });
    if (existing) throw new Error("Email already in use");

    const user = await tx.user.create({ data: { email: normalisedEmail, passwordHash } });
    const profile = await tx.profile.create({ data: { userId: user.id, name } });
    return { user, profile };
  });
}
