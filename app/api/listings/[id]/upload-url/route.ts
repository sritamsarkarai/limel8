import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getSignedUploadParams } from "@/lib/cloudinary";
import { db } from "@/lib/db";
import { getProfileByUserId } from "@/modules/profiles/queries";

export const dynamic = "force-dynamic";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const profile = await getProfileByUserId(session.user.id);
  if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

  const { id } = await params;

  const listing = await db.listing.findUnique({ where: { id }, select: { sellerId: true } });
  if (!listing) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (listing.sellerId !== profile.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") === "download" ? "raw" : "image";
  const folder = type === "raw" ? "downloads" : "listing-previews";

  const uploadParams = await getSignedUploadParams(folder, type);
  return NextResponse.json(uploadParams);
}
