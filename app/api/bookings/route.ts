import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getProfileByUserId } from "@/modules/profiles/queries";
import { createBooking } from "@/modules/organizations/mutations";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const profile = await getProfileByUserId(session.user.id);
  if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

  const body = await req.json();
  const { serviceId, requestedDate, message } = body;
  if (!serviceId || !requestedDate) {
    return NextResponse.json({ error: "serviceId and requestedDate are required" }, { status: 400 });
  }

  const service = await db.service.findUnique({ where: { id: serviceId } });
  if (!service) return NextResponse.json({ error: "Service not found" }, { status: 404 });

  const org = await db.organization.findUnique({ where: { id: service.orgId } });
  if (!org) return NextResponse.json({ error: "Organization not found" }, { status: 404 });
  if (org.ownerId === profile.id) {
    return NextResponse.json({ error: "Cannot book your own organization" }, { status: 400 });
  }

  const booking = await createBooking({
    serviceId,
    orgId: service.orgId,
    customerId: profile.id,
    requestedDate,
    message,
  });
  return NextResponse.json(booking, { status: 201 });
}
