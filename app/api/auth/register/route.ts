import { NextResponse } from "next/server";
import { registerUser } from "@/modules/auth/register";

const USER_FACING_ERRORS = new Set([
  "Email already in use",
  "Password must be at least 8 characters",
]);

export async function POST(req: Request) {
  const { email, password, name } = await req.json();
  if (!email || !password || !name) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }
  try {
    await registerUser({ email, password, name });
    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Registration failed";
    if (e instanceof Error && USER_FACING_ERRORS.has(e.message)) {
      return NextResponse.json({ error: message }, { status: 409 });
    }
    console.error("Registration error:", e);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
