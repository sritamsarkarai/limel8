import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getProfileById, getProfileByUserId } from "@/modules/profiles/queries";
import { updateProfile } from "@/modules/profiles/mutations";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const result = await getProfileById(id);
  if (!result) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(result);
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  // Verify the requester owns this profile (id is a p_-prefixed id)
  if (!id.startsWith("p_")) {
    return NextResponse.json({ error: "Invalid profile id" }, { status: 400 });
  }
  const profileId = id.slice(2);

  const ownProfile = await getProfileByUserId(session.user.id);
  if (!ownProfile || ownProfile.id !== profileId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const updated = await updateProfile(profileId, body);
  return NextResponse.json(updated);
}
