import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { addGroupMember, removeGroupMember } from "@/modules/profiles/mutations";
import { getProfileByUserId } from "@/modules/profiles/queries";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

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

  const requestingProfile = await getProfileByUserId(session.user.id);
  if (!requestingProfile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }
  if (requestingProfile.id !== profileId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
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

  // DELETE: only allow removing own membership, or group admin can remove others
  const requestingProfile = await getProfileByUserId(session.user.id);
  if (!requestingProfile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }
  // Allow if removing own profile
  if (requestingProfile.id !== profileId) {
    // Check if requester is the group admin
    const group = await db.group.findUnique({ where: { id: groupId }, select: { adminId: true } });
    if (!group) {
      return NextResponse.json({ error: "Group not found" }, { status: 404 });
    }
    if (group.adminId !== requestingProfile.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }
  await removeGroupMember(groupId, profileId);
  return new Response(null, { status: 204 });
}
