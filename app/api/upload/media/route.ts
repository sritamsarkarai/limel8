import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getSignedUploadParams } from "@/lib/cloudinary";

export const dynamic = "force-dynamic";

// Returns signed upload params for a Cloudinary direct upload.
// The client uploads the file directly to Cloudinary using these params.
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const resourceType = body.resourceType as "image" | "video" | "raw" | undefined;
  const allowed = ["image", "video", "raw"] as const;
  const type = allowed.includes(resourceType as (typeof allowed)[number]) ? (resourceType as (typeof allowed)[number]) : "image";

  const params = await getSignedUploadParams("post-media", type);
  return NextResponse.json(params);
}
