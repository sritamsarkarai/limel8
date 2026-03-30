import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getSignedUploadParams } from "@/lib/cloudinary";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // params is awaited to satisfy Next.js 16 convention, id is not needed for upload params
  await params;

  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") === "download" ? "raw" : "image";
  const folder = type === "raw" ? "downloads" : "listing-previews";

  const uploadParams = await getSignedUploadParams(folder, type);
  return NextResponse.json(uploadParams);
}
