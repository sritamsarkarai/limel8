import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendPasswordResetEmail } from "@/lib/email";
import crypto from "crypto";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const { email } = await req.json();
  if (!email) return NextResponse.json({ error: "Missing email" }, { status: 400 });

  const normalised = email.toLowerCase().trim();
  const user = await db.user.findUnique({ where: { email: normalised } });

  if (!user || !user.passwordHash) {
    return NextResponse.json({ error: "NO_ACCOUNT" }, { status: 404 });
  }

  const token = crypto.randomBytes(32).toString("hex");
  const expiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  await db.user.update({
    where: { id: user.id },
    data: { passwordResetToken: token, passwordResetExpiry: expiry },
  });

  try {
    await sendPasswordResetEmail(user.email, token);
  } catch (err) {
    console.error("Failed to send password reset email:", err);
  }

  return NextResponse.json({ ok: true });
}
