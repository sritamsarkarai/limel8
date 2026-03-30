import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { sendShippingNotification } from "@/lib/resend";

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    const order = await db.order.findUnique({
      where: { id },
      include: { seller: true, buyer: { include: { user: true } } },
    });
    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

    const profile = await db.profile.findUnique({ where: { userId: session.user.id } });
    if (!profile || order.sellerId !== profile.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (order.status !== "paid") {
      return NextResponse.json({ error: "Order is not in paid status" }, { status: 400 });
    }

    await db.order.update({ where: { id }, data: { status: "shipped" } });

    if (order.buyer.user.email) {
      await sendShippingNotification(order.buyer.user.email, id);
    }

    return NextResponse.json({ success: true });
  } catch (e: unknown) {
    console.error(e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
