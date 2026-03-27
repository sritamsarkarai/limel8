import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getProfileByUserId } from "@/modules/profiles/queries";
import { follow, unfollow } from "@/modules/feed/mutations";

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
    const { profileId, groupId } = body;

    if (!profileId && !groupId) {
      return NextResponse.json({ error: "Must provide profileId or groupId" }, { status: 400 });
    }
    if (profileId && groupId) {
      return NextResponse.json({ error: "Cannot follow both a profile and a group at once" }, { status: 400 });
    }

    const result = await follow(profile.id, { profileId, groupId });
    return NextResponse.json(result, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
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
    const { profileId, groupId } = body;

    if (!profileId && !groupId) {
      return NextResponse.json({ error: "Must provide profileId or groupId" }, { status: 400 });
    }
    if (profileId && groupId) {
      return NextResponse.json({ error: "Cannot unfollow both a profile and a group at once" }, { status: 400 });
    }

    await unfollow(profile.id, { profileId, groupId });
    return new NextResponse(null, { status: 204 });
  } catch (err) {
    console.error(err);
    if (err instanceof Error && err.message === "Follow not found") {
      return NextResponse.json({ error: "Follow not found" }, { status: 404 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
