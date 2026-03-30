import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getProfileByUserId } from "@/modules/profiles/queries";
import { cancelSubscription } from "@/modules/subscription/mutations";

export async function DELETE() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const profile = await getProfileByUserId(session.user.id);
    if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    await cancelSubscription(profile.id);
    return NextResponse.json({ cancelled: true });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Internal server error";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
