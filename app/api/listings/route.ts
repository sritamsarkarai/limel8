import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getListings } from "@/modules/marketplace/queries";
import { createListing } from "@/modules/marketplace/mutations";
import { getProfileByUserId } from "@/modules/profiles/queries";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const cursor = searchParams.get("cursor") ?? undefined;
    const listings = await getListings(cursor);
    return NextResponse.json(listings);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

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
    const { title, description, price, type, previewMediaUrls, cloudinaryDownloadId, stockQuantity } = body;

    if (!title || !description || price == null || !type) {
      return NextResponse.json({ error: "Missing required fields: title, description, price, type" }, { status: 400 });
    }

    if (typeof price !== "number" || price <= 0) {
      return NextResponse.json({ error: "Price must be a positive number" }, { status: 400 });
    }

    const listing = await createListing(profile.id, {
      title,
      description,
      price,
      type,
      previewMediaUrls,
      cloudinaryDownloadId,
      stockQuantity,
    });
    return NextResponse.json(listing, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
