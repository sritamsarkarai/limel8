import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

interface RegisterInput {
  email: string;
  password: string;
  name: string;
}

export async function registerUser({ email, password, name }: RegisterInput) {
  const existing = await db.user.findUnique({ where: { email } });
  if (existing) throw new Error("Email already in use");

  const passwordHash = await bcrypt.hash(password, 12);

  return db.$transaction(async (tx) => {
    const user = await tx.user.create({ data: { email, passwordHash } });
    const profile = await tx.profile.create({
      data: { userId: user.id, name },
    });
    return { user, profile };
  });
}
