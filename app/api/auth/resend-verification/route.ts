import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendVerificationEmail } from "@/lib/email";
import crypto from "crypto";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const { email } = await req.json();
  if (!email) return NextResponse.json({ error: "Missing email" }, { status: 400 });

  const user = await db.user.findUnique({ where: { email: email.toLowerCase().trim() } });

  // Always respond ok — don't reveal whether the email exists
  if (!user || user.emailVerified) {
    return NextResponse.json({ ok: true });
  }

  const token = crypto.randomBytes(32).toString("hex");
  const expiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

  await db.user.update({
    where: { id: user.id },
    data: { emailVerificationToken: token, emailVerificationExpiry: expiry },
  });

  await sendVerificationEmail(user.email, token);

  return NextResponse.json({ ok: true });
}
