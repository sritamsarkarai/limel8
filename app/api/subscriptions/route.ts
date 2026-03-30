import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getProfileByUserId } from "@/modules/profiles/queries";
import { createSubscriptionCheckout } from "@/modules/subscription/mutations";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { tier } = await req.json();
    if (tier !== "monthly" && tier !== "annual") {
      return NextResponse.json({ error: "tier must be 'monthly' or 'annual'" }, { status: 400 });
    }

    const profile = await getProfileByUserId(session.user.id);
    if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

    const email = session.user.email;
    if (!email) return NextResponse.json({ error: "User email not available" }, { status: 400 });

    const url = await createSubscriptionCheckout(profile.id, tier, email);
    return NextResponse.json({ url });
  } catch (e: unknown) {
    console.error(e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
