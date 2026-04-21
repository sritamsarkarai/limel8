import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(new URL("/verify-email?error=missing", req.url));
  }

  const user = await db.user.findUnique({
    where: { emailVerificationToken: token },
  });

  if (!user) {
    return NextResponse.redirect(new URL("/verify-email?error=invalid", req.url));
  }

  if (user.emailVerificationExpiry && user.emailVerificationExpiry < new Date()) {
    return NextResponse.redirect(new URL("/verify-email?error=expired", req.url));
  }

  await db.user.update({
    where: { id: user.id },
    data: {
      emailVerified: new Date(),
      emailVerificationToken: null,
      emailVerificationExpiry: null,
    },
  });

  return NextResponse.redirect(new URL("/verify-email?success=1", req.url));
}
