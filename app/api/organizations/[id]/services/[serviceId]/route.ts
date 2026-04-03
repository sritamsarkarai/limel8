import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getProfileByUserId } from "@/modules/profiles/queries";
import { getOrgById } from "@/modules/organizations/queries";
import { updateService, deleteService } from "@/modules/organizations/mutations";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

async function requireServiceOwner(orgId: string, serviceId: string, userId: string) {
  const [org, profile, service] = await Promise.all([
    getOrgById(orgId),
    getProfileByUserId(userId),
    db.service.findUnique({ where: { id: serviceId } }),
  ]);
  if (!org || !service || service.orgId !== orgId) return { error: "Not found", status: 404 } as const;
  if (!profile || org.ownerId !== profile.id) return { error: "Forbidden", status: 403 } as const;
  return { org, service, profile };
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string; serviceId: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id, serviceId } = await params;
  const check = await requireServiceOwner(id, serviceId, session.user.id);
  if ("error" in check) return NextResponse.json({ error: check.error }, { status: check.status });

  const body = await req.json();
  const { name, description, price, duration } = body;
  const updated = await updateService(serviceId, {
    name,
    description,
    price: price !== undefined ? (price != null ? Number(price) : null) : undefined,
    duration,
  });
  return NextResponse.json(updated);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string; serviceId: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id, serviceId } = await params;
  const check = await requireServiceOwner(id, serviceId, session.user.id);
  if ("error" in check) return NextResponse.json({ error: check.error }, { status: check.status });

  await deleteService(serviceId);
  return NextResponse.json({ ok: true });
}
