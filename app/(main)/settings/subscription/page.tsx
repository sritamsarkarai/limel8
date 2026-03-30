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
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Subscription</h1>

      {success === "1" && (
        <div className="mb-6 rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-green-800 text-sm font-medium">
          Subscription activated! You now enjoy zero platform fees on all listings.
        </div>
      )}

      {isActive ? (
        <div className="rounded-xl border border-gray-200 bg-white p-6 space-y-4">
          <div>
            <p className="text-sm text-gray-500 uppercase tracking-wide font-semibold">Current plan</p>
            <p className="mt-1 text-xl font-bold text-gray-900">
              {profile.subscriptionTier === "monthly"
                ? "Monthly — $30/month"
                : "Annual — $200/year"}
            </p>
          </div>
          <p className="text-sm text-gray-600">
            As a subscriber, you pay <strong>zero platform fees</strong> on all your listings, regardless of price.
          </p>
          <CancelSubscriptionButton />
        </div>
      ) : (
        <div className="space-y-6">
          <p className="text-gray-700">
            Upgrade to a paid plan and pay <strong>zero platform fees</strong> on every sale — no matter the listing price.
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-gray-200 bg-white p-6 space-y-4">
              <div>
                <p className="text-lg font-bold text-gray-900">Monthly</p>
                <p className="text-3xl font-extrabold text-gray-900 mt-1">$30<span className="text-base font-normal text-gray-500">/mo</span></p>
              </div>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>Zero platform fees</li>
                <li>Cancel anytime</li>
              </ul>
              <SubscribeButton tier="monthly" />
            </div>

            <div className="rounded-xl border border-indigo-300 bg-indigo-50 p-6 space-y-4">
              <div>
                <p className="text-lg font-bold text-gray-900">Annual <span className="text-xs font-semibold text-indigo-600 ml-1">BEST VALUE</span></p>
                <p className="text-3xl font-extrabold text-gray-900 mt-1">$200<span className="text-base font-normal text-gray-500">/yr</span></p>
                <p className="text-xs text-gray-500 mt-0.5">~$16.67/month — save $160/year</p>
              </div>
              <ul className="text-sm text-gray-600 space-y-1">
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
