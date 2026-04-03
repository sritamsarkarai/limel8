import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getOrgBySlug } from "@/modules/organizations/queries";
import { getProfileByUserId } from "@/modules/profiles/queries";
import Link from "next/link";

const CATEGORY_LABELS: Record<string, string> = {
  studio: "Studio",
  dance_school: "Dance School",
  vocal_school: "Vocal School",
  music_school: "Music School",
  photography_studio: "Photography Studio",
  recording_studio: "Recording Studio",
  rehearsal_space: "Rehearsal Space",
  event_venue: "Event Venue",
  other: "Other",
};

export default async function PublicOrgPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [org, session] = await Promise.all([
    getOrgBySlug(slug),
    getServerSession(authOptions),
  ]);
  if (!org) return notFound();

  const currentProfile = session?.user?.id
    ? await getProfileByUserId(session.user.id)
    : null;

  const isOwner = currentProfile?.id === org.ownerId;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      {/* Banner */}
      <div className="h-36 rounded-2xl overflow-hidden bg-gradient-to-br from-cyan-950 via-sky-900 to-violet-950">
        {org.bannerUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={org.bannerUrl} alt="Banner" className="w-full h-full object-cover" />
        )}
      </div>

      {/* Avatar + info */}
      <div className="flex items-start gap-4 -mt-10 px-2">
        {org.avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={org.avatarUrl} alt={org.name} className="w-20 h-20 rounded-xl object-cover border-4 border-zinc-950 shadow-lg shrink-0" />
        ) : (
          <div className="w-20 h-20 rounded-xl bg-cyan-950 border-4 border-zinc-950 flex items-center justify-center shrink-0">
            <span className="text-2xl font-bold text-cyan-400">{org.name[0].toUpperCase()}</span>
          </div>
        )}
        <div className="flex-1 mt-10 space-y-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "var(--font-heading)" }}>{org.name}</h1>
            {isOwner && (
              <Link
                href={`/orgs/${org.id}`}
                className="text-xs font-bold text-zinc-950 bg-gradient-to-r from-cyan-400 to-violet-400 px-3 py-1 rounded-lg hover:opacity-90 cursor-pointer"
              >
                Manage
              </Link>
            )}
          </div>
          <p className="text-sm text-zinc-400">{CATEGORY_LABELS[org.category] ?? org.category}</p>
          <p className="text-xs text-zinc-500">by {org.owner.name}</p>
        </div>
      </div>

      {/* Description */}
      {org.description && (
        <div>
          <h2 className="text-base font-semibold text-white mb-1" style={{ fontFamily: "var(--font-heading)" }}>About</h2>
          <p className="text-zinc-400 text-sm leading-relaxed whitespace-pre-wrap">{org.description}</p>
        </div>
      )}

      {/* Services */}
      <div>
        <h2 className="text-base font-semibold text-white mb-3" style={{ fontFamily: "var(--font-heading)" }}>Services</h2>
        {org.services.length === 0 ? (
          <p className="text-sm text-zinc-500">No services listed yet.</p>
        ) : (
          <div className="space-y-3">
            {org.services.map((service) => (
              <div
                key={service.id}
                className="flex items-center justify-between rounded-xl border border-cyan-500/[0.27] bg-zinc-900 px-4 py-4 shadow-[0_0_0_1px_rgba(34,211,238,0.13),0_0_12px_rgba(34,211,238,0.06)]"
              >
                <div>
                  <p className="font-semibold text-white text-sm">{service.name}</p>
                  {service.description && <p className="text-xs text-zinc-500 mt-0.5">{service.description}</p>}
                  <p className="text-xs mt-1">
                    {service.price
                      ? <span className="text-cyan-400 font-bold">${String(service.price)}</span>
                      : <span className="text-green-400 font-bold">Free</span>}
                    {service.duration && <span className="text-zinc-500"> · {service.duration}</span>}
                  </p>
                </div>
                {!isOwner && currentProfile && (
                  <Link
                    href={`/org/${slug}/book/${service.id}`}
                    className="rounded-lg bg-gradient-to-r from-cyan-400 to-violet-400 px-4 py-2 text-sm font-bold text-zinc-950 cursor-pointer hover:opacity-90 transition-opacity shrink-0 ml-4"
                  >
                    Book
                  </Link>
                )}
                {!currentProfile && (
                  <Link href="/login" className="rounded-lg border border-cyan-500/[0.27] px-4 py-2 text-sm font-medium text-cyan-400 cursor-pointer hover:bg-cyan-950/40 transition-colors shrink-0 ml-4">
                    Sign in to book
                  </Link>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
