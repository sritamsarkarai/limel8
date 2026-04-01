import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const profile = await db.profile.findUnique({ where: { userId: session.user.id } });
    if (!profile) return NextResponse.json({ error: "No profile" }, { status: 400 });

    let accountId = profile.stripeAccountId;
    if (!accountId) {
      const account = await stripe.accounts.create({ type: "express" });
      accountId = account.id;
      // Only write if stripeAccountId is still null (guards against concurrent requests)
      const updated = await db.profile.updateMany({
        where: { id: profile.id, stripeAccountId: null },
        data: { stripeAccountId: accountId },
      });
      if (updated.count === 0) {
        // Another request already created an account; refetch to get the correct ID
        const refreshed = await db.profile.findUnique({ where: { id: profile.id } });
        accountId = refreshed?.stripeAccountId ?? accountId;
      }
    }

    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: `${process.env.NEXTAUTH_URL}/api/connect/onboard`,
      return_url: `${process.env.NEXTAUTH_URL}/api/connect/return`,
      type: "account_onboarding",
    });

    return NextResponse.json({ url: accountLink.url });
  } catch (e: unknown) {
    console.error(e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
