import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { OrgForm } from "@/components/organizations/OrgForm";

export default async function NewOrgPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  return (
    <main className="mx-auto max-w-xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent" style={{ fontFamily: "var(--font-heading)" }}>
        Create Organization
      </h1>
      <div className="rounded-2xl border border-cyan-500/[0.27] bg-zinc-900 p-6 shadow-[0_0_0_1px_rgba(34,211,238,0.13),0_0_20px_rgba(34,211,238,0.13),0_0_40px_rgba(34,211,238,0.05)]">
        <OrgForm mode="create" />
      </div>
    </main>
  );
}
