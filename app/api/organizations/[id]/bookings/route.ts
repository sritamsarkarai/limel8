import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getProfileByUserId } from "@/modules/profiles/queries";
import { getOrgById, getBookingsForOrg } from "@/modules/organizations/queries";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const [org, profile] = await Promise.all([
    getOrgById(id),
    getProfileByUserId(session.user.id),
  ]);
  if (!org) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (!profile || org.ownerId !== profile.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const bookings = await getBookingsForOrg(id);
  return NextResponse.json(bookings);
}
