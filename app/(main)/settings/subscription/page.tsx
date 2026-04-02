import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getProfileByUserId } from "@/modules/profiles/queries";
import { SubscribeButton, CancelSubscriptionButton } from "./SubscriptionButtons";

export default async function SubscriptionPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const profile = await getProfileByUserId(session.user.id);
  if (!profile) redirect("/login");

  const { success } = await searchParams;
  const isActive = profile.subscriptionStatus === "active";

  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="mb-6 text-2xl font-bold bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent" style={{ fontFamily: "var(--font-heading)" }}>
        Subscription
      </h1>

      {success === "1" && (
        <div className="mb-6 rounded-lg bg-cyan-950 border border-cyan-500/40 px-4 py-3 text-cyan-300 text-sm font-medium shadow-[0_0_8px_rgba(34,211,238,0.2)]">
          Subscription activated! You now enjoy zero platform fees on all listings.
        </div>
      )}

      {isActive ? (
        <div className="rounded-xl border border-cyan-500/[0.27] bg-zinc-900 p-6 space-y-4 shadow-[0_0_0_1px_rgba(34,211,238,0.13),0_0_20px_rgba(34,211,238,0.13),0_0_40px_rgba(34,211,238,0.05)]">
          <div>
            <p className="text-xs text-zinc-500 uppercase tracking-wide font-semibold">Current plan</p>
            <p className="mt-1 text-xl font-bold text-white">
              {profile.subscriptionTier === "monthly"
                ? "Monthly — $30/month"
                : "Annual — $200/year"}
            </p>
          </div>
          <p className="text-sm text-zinc-400">
            As a subscriber, you pay <strong className="text-white">zero platform fees</strong> on all your listings, regardless of price.
          </p>
          <CancelSubscriptionButton />
        </div>
      ) : (
        <div className="space-y-6">
          <p className="text-zinc-400">
            Upgrade to a paid plan and pay <strong className="text-white">zero platform fees</strong> on every sale — no matter the listing price.
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-cyan-500/[0.27] bg-zinc-900 p-6 space-y-4 shadow-[0_0_0_1px_rgba(34,211,238,0.13),0_0_20px_rgba(34,211,238,0.13),0_0_40px_rgba(34,211,238,0.05)]">
              <div>
                <p className="text-lg font-bold text-white">Monthly</p>
                <p className="text-3xl font-extrabold text-white mt-1">$30<span className="text-base font-normal text-zinc-500">/mo</span></p>
              </div>
              <ul className="text-sm text-zinc-400 space-y-1">
                <li>Zero platform fees</li>
                <li>Cancel anytime</li>
              </ul>
              <SubscribeButton tier="monthly" />
            </div>

            <div className="rounded-xl border border-violet-400/[0.27] bg-zinc-900 p-6 space-y-4 shadow-[0_0_0_1px_rgba(167,139,250,0.13),0_0_20px_rgba(167,139,250,0.13),0_0_40px_rgba(167,139,250,0.05)]">
              <div>
                <p className="text-lg font-bold text-white">Annual <span className="text-xs font-semibold text-violet-400 ml-1">BEST VALUE</span></p>
                <p className="text-3xl font-extrabold text-white mt-1">$200<span className="text-base font-normal text-zinc-500">/yr</span></p>
                <p className="text-xs text-zinc-500 mt-0.5">~$16.67/month — save $160/year</p>
              </div>
              <ul className="text-sm text-zinc-400 space-y-1">
                <li>Zero platform fees</li>
                <li>Cancel anytime</li>
              </ul>
              <SubscribeButton tier="annual" />
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
