import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getProfileByUserId } from "@/modules/profiles/queries";
import { sendMessage } from "@/modules/messaging/mutations";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const profile = await getProfileByUserId(session.user.id);
  if (!profile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  try {
    const body = await req.json();
    const { recipientId, content } = body;
    if (!recipientId || !content) {
      return NextResponse.json({ error: "Missing required fields: recipientId, content" }, { status: 400 });
    }

    const message = await sendMessage(profile.id, recipientId, content);
    return NextResponse.json(message, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
