import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getProfileByUserId } from "@/modules/profiles/queries";
import { getOrgsByOwner } from "@/modules/organizations/queries";
import { OrgCard } from "@/components/organizations/OrgCard";
import Link from "next/link";

export default async function OrgsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");
  const profile = await getProfileByUserId(session.user.id);
  if (!profile) redirect("/login");

  const orgs = await getOrgsByOwner(profile.id);

  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent" style={{ fontFamily: "var(--font-heading)" }}>
          My Organizations
        </h1>
        <Link
          href="/orgs/new"
          className="rounded-lg bg-gradient-to-r from-cyan-400 to-violet-400 px-4 py-2 text-sm font-bold text-zinc-950 cursor-pointer hover:opacity-90 transition-opacity shadow-[0_0_20px_rgba(34,211,238,0.2)]"
        >
          + Create
        </Link>
      </div>
      {orgs.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-zinc-400 mb-4">You haven&apos;t created any organizations yet.</p>
          <Link href="/orgs/new" className="text-cyan-400 hover:text-cyan-300 text-sm font-medium transition-colors">
            Create your first organization →
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {orgs.map((org) => <OrgCard key={org.id} org={org} />)}
        </div>
      )}
    </main>
  );
}
