import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getDownloadUrl } from "@/lib/cloudinary";

export const dynamic = "force-dynamic";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    const order = await db.order.findUnique({ where: { id }, include: { buyer: true } });
    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

    const profile = await db.profile.findUnique({ where: { userId: session.user.id } });
    if (!profile || order.buyerId !== profile.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (order.status !== "complete") {
      return NextResponse.json({ error: "Order not complete" }, { status: 403 });
    }

    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    if (order.createdAt < thirtyDaysAgo) {
      return NextResponse.json({ error: "Download link expired" }, { status: 403 });
    }

    const listing = await db.listing.findUnique({ where: { id: order.listingId } });
    if (!listing?.cloudinaryDownloadId) {
      return NextResponse.json({ error: "Download not available" }, { status: 404 });
    }

    const url = getDownloadUrl(listing.cloudinaryDownloadId);
    return NextResponse.json({ url });
  } catch (e: unknown) {
    console.error(e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
