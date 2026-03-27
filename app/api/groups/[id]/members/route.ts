import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { addGroupMember, removeGroupMember } from "@/modules/profiles/mutations";
import { getProfileByUserId } from "@/modules/profiles/queries";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: groupId } = await params;
  const body = await req.json();
  const { profileId } = body;
  if (!profileId) {
    return NextResponse.json({ error: "Missing required field: profileId" }, { status: 400 });
  }

  const member = await addGroupMember(groupId, profileId);
  return NextResponse.json(member, { status: 201 });
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: groupId } = await params;
  const body = await req.json();
  const { profileId } = body;
  if (!profileId) {
    return NextResponse.json({ error: "Missing required field: profileId" }, { status: 400 });
  }

  // Only allow the requesting user to remove their own profile, or the group admin
  const requestingProfile = await getProfileByUserId(session.user.id);
  if (!requestingProfile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  await removeGroupMember(groupId, profileId);
  return new Response(null, { status: 204 });
}
