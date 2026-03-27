import { NextResponse } from "next/server";
import { registerUser } from "@/modules/auth/register";

export async function POST(req: Request) {
  const { email, password, name } = await req.json();
  if (!email || !password || !name) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }
  try {
    await registerUser({ email, password, name });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 409 });
  }
}
