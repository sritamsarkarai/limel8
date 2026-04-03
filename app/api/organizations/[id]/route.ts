import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getProfileByUserId } from "@/modules/profiles/queries";
import { getOrgById } from "@/modules/organizations/queries";
import { updateOrg, deleteOrg } from "@/modules/organizations/mutations";
import { OrgCategory } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const org = await getOrgById(id);
  if (!org) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(org);
}

async function requireOwner(orgId: string, userId: string) {
  const [org, profile] = await Promise.all([
    getOrgById(orgId),
    getProfileByUserId(userId),
  ]);
  if (!org) return { error: "Not found", status: 404 } as const;
  if (!profile || org.ownerId !== profile.id) return { error: "Forbidden", status: 403 } as const;
  return { org, profile };
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const check = await requireOwner(id, session.user.id);
  if ("error" in check) return NextResponse.json({ error: check.error }, { status: check.status });

  const body = await req.json();
  const { name, category, description, avatarUrl, bannerUrl } = body;
  if (category && !Object.values(OrgCategory).includes(category)) {
    return NextResponse.json({ error: "Invalid category" }, { status: 400 });
  }
  const updated = await updateOrg(id, { name, category, description, avatarUrl, bannerUrl });
  return NextResponse.json(updated);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const check = await requireOwner(id, session.user.id);
  if ("error" in check) return NextResponse.json({ error: check.error }, { status: check.status });
  await deleteOrg(id);
  return NextResponse.json({ ok: true });
}
