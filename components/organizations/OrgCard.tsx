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

type OrgCardProps = {
  org: {
    id: string;
    slug: string;
    name: string;
    category: string;
    description?: string | null;
    avatarUrl?: string | null;
    services: { id: string }[];
  };
};

export function OrgCard({ org }: OrgCardProps) {
  return (
    <Link
      href={`/org/${org.slug}`}
      className="flex items-start gap-3 rounded-xl border border-cyan-500/[0.27] bg-zinc-900 p-4 shadow-[0_0_0_1px_rgba(34,211,238,0.13),0_0_12px_rgba(34,211,238,0.06)] hover:shadow-[0_0_0_1px_rgba(34,211,238,0.27),0_0_20px_rgba(34,211,238,0.13)] hover:border-cyan-500/40 transition-all duration-200 cursor-pointer group"
    >
      {org.avatarUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={org.avatarUrl} alt={org.name} className="w-12 h-12 rounded-xl object-cover shrink-0 border border-zinc-700" />
      ) : (
        <div className="w-12 h-12 rounded-xl bg-cyan-950 border border-cyan-500/[0.27] flex items-center justify-center shrink-0">
          <span className="text-lg font-bold text-cyan-400">{org.name[0].toUpperCase()}</span>
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-white text-sm truncate group-hover:text-cyan-400 transition-colors">{org.name}</p>
        <p className="text-xs text-zinc-500 mt-0.5">{CATEGORY_LABELS[org.category] ?? org.category}</p>
        {org.description && (
          <p className="text-xs text-zinc-400 mt-1 line-clamp-2">{org.description}</p>
        )}
        <p className="text-xs text-zinc-600 mt-1">{org.services.length} service{org.services.length !== 1 ? "s" : ""}</p>
      </div>
    </Link>
  );
}
