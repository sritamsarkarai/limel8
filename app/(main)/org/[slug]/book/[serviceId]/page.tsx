import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getOrgBySlug } from "@/modules/organizations/queries";
import { BookingRequestForm } from "@/components/organizations/BookingRequestForm";
import Link from "next/link";

export default async function BookingPage({
  params,
}: {
  params: Promise<{ slug: string; serviceId: string }>;
}) {
  const { slug, serviceId } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const org = await getOrgBySlug(slug);
  if (!org) return notFound();

  const service = org.services.find((s) => s.id === serviceId);
  if (!service) return notFound();

  return (
    <main className="mx-auto max-w-md px-4 py-8">
      <div className="mb-6">
        <Link href={`/org/${slug}`} className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
          ← Back to {org.name}
        </Link>
        <h1 className="mt-2 text-2xl font-bold bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent" style={{ fontFamily: "var(--font-heading)" }}>
          Book a Session
        </h1>
      </div>
      <BookingRequestForm
        serviceId={service.id}
        serviceName={service.name}
        servicePrice={service.price?.toString() ?? null}
        orgSlug={slug}
      />
    </main>
  );
}
