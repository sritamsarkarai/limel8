import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getProfileByUserId } from "@/modules/profiles/queries";
import { getOrgsByOwner } from "@/modules/organizations/queries";
import { createOrg } from "@/modules/organizations/mutations";
import { OrgCategory } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const profile = await getProfileByUserId(session.user.id);
  if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  const orgs = await getOrgsByOwner(profile.id);
  return NextResponse.json(orgs);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const profile = await getProfileByUserId(session.user.id);
  if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

  const body = await req.json();
  const { name, slug, category, description } = body;

  if (!name || !slug || !category) {
    return NextResponse.json({ error: "name, slug, and category are required" }, { status: 400 });
  }

  const validCategories = Object.values(OrgCategory);
  if (!validCategories.includes(category)) {
    return NextResponse.json({ error: "Invalid category" }, { status: 400 });
  }

  if (!/^[a-z0-9-]+$/.test(slug)) {
    return NextResponse.json({ error: "Slug may only contain lowercase letters, numbers, and hyphens" }, { status: 400 });
  }

  try {
    const org = await createOrg({ name, slug, category, description, ownerId: profile.id });
    return NextResponse.json(org, { status: 201 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "";
    if (msg.includes("Unique constraint")) {
      return NextResponse.json({ error: "That slug is already taken" }, { status: 409 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
