import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getProfileByUserId } from "@/modules/profiles/queries";
import { getMessages } from "@/modules/messaging/queries";
import { markThreadRead } from "@/modules/messaging/mutations";

export const dynamic = "force-dynamic";

export async function GET(_req: Request, { params }: { params: Promise<{ profileId: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { profileId } = await params;
    const profile = await getProfileByUserId(session.user.id);
    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const messages = await getMessages(profile.id, profileId);
    // Mark messages read when viewing thread
    await markThreadRead(profile.id, profileId);
    return NextResponse.json(messages);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(_req: Request, { params }: { params: Promise<{ profileId: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { profileId } = await params;
    const profile = await getProfileByUserId(session.user.id);
    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    await markThreadRead(profile.id, profileId);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
