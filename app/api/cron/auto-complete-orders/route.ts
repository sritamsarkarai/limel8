import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  try {
    const result = await db.order.updateMany({
      where: { status: "shipped", updatedAt: { lt: sevenDaysAgo } },
      data: { status: "complete" },
    });
    return NextResponse.json({ completed: result.count });
  } catch (e: unknown) {
    console.error("Cron auto-complete error:", e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
