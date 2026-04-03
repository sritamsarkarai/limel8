import { redirect, notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getProfileByUserId } from "@/modules/profiles/queries";
import { getOrgById, getBookingsForOrg } from "@/modules/organizations/queries";
import { OrgForm } from "@/components/organizations/OrgForm";
import { ServiceForm } from "@/components/organizations/ServiceForm";
import { BookingList } from "@/components/organizations/BookingList";
import Link from "next/link";

export default async function OrgDashboardPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");
  const profile = await getProfileByUserId(session.user.id);
  if (!profile) redirect("/login");

  const org = await getOrgById(id);
  if (!org) return notFound();
  if (org.ownerId !== profile.id) redirect("/orgs");

  const bookings = await getBookingsForOrg(id);

  return (
    <main className="mx-auto max-w-2xl px-4 py-8 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent" style={{ fontFamily: "var(--font-heading)" }}>
          {org.name}
        </h1>
        <Link href={`/org/${org.slug}`} className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors">
          View public page →
        </Link>
      </div>

      {/* Edit org details */}
      <section className="rounded-2xl border border-cyan-500/[0.27] bg-zinc-900 p-6 shadow-[0_0_0_1px_rgba(34,211,238,0.13),0_0_20px_rgba(34,211,238,0.13),0_0_40px_rgba(34,211,238,0.05)]">
        <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-4">Organization Details</h2>
        <OrgForm
          mode="edit"
          orgId={org.id}
          initial={{ name: org.name, category: org.category, description: org.description }}
        />
      </section>

      {/* Services */}
      <section className="space-y-4">
        <h2 className="text-base font-semibold text-white" style={{ fontFamily: "var(--font-heading)" }}>Services</h2>
        {org.services.length > 0 && (
          <div className="space-y-2">
            {org.services.map((service) => (
              <div key={service.id} className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-white">{service.name}</p>
                  <p className="text-xs text-zinc-500">
                    {service.price ? `$${service.price}` : "Free"}
                    {service.duration ? ` · ${service.duration}` : ""}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
        <ServiceForm orgId={org.id} />
      </section>

      {/* Bookings */}
      <section className="space-y-4">
        <h2 className="text-base font-semibold text-white" style={{ fontFamily: "var(--font-heading)" }}>Bookings</h2>
        <BookingList bookings={bookings.map(b => ({
          ...b,
          createdAt: b.createdAt.toISOString(),
          service: { ...b.service, price: b.service.price?.toString() ?? null },
        }))} orgId={org.id} />
      </section>
    </main>
  );
}
