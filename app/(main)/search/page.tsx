import { searchProfiles } from "@/modules/search/queries";
import { ProfileCard } from "@/components/search/ProfileCard";

const AVAILABILITY_OPTIONS = [
  { value: "", label: "Any availability" },
  { value: "available_for_hire", label: "Available for Hire" },
  { value: "open_to_collab", label: "Open to Collab" },
  { value: "open_to_join", label: "Open to Join" },
  { value: "not_available", label: "Not Available" },
];

const inputClass = "rounded-lg border border-cyan-500/[0.27] bg-zinc-800 px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:border-cyan-500/[0.4] focus:outline-none shadow-[0_0_0_1px_rgba(34,211,238,0.13),0_0_12px_rgba(34,211,238,0.08)] focus:shadow-[0_0_0_1px_rgba(34,211,238,0.27),0_0_20px_rgba(34,211,238,0.16)]";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ query?: string; artistType?: string; availability?: string; location?: string }>;
}) {
  const { query, artistType, availability, location } = await searchParams;

  const profiles = await searchProfiles({
    query,
    artistType,
    availability: availability as Parameters<typeof searchProfiles>[0]["availability"],
    location,
  });

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent" style={{ fontFamily: "var(--font-heading)" }}>
        Discover Artists
      </h1>

      <form method="get" action="/search" className="mb-8 space-y-4">
        <div className="flex gap-2">
          <input
            type="text"
            name="query"
            defaultValue={query ?? ""}
            placeholder="Search by name, bio, or artist type..."
            className={`flex-1 ${inputClass}`}
          />
          <button
            type="submit"
            className="rounded-lg bg-gradient-to-r from-cyan-400 to-violet-400 px-4 py-2 text-sm font-bold text-zinc-950 shadow-[0_0_20px_rgba(34,211,238,0.2),0_4px_12px_rgba(34,211,238,0.13)] hover:opacity-90 transition-opacity"
          >
            Search
          </button>
        </div>

        <div className="flex flex-wrap gap-3">
          <input
            type="text"
            name="artistType"
            defaultValue={artistType ?? ""}
            placeholder="Artist type (e.g. guitarist)"
            className={inputClass}
          />

          <select
            name="availability"
            defaultValue={availability ?? ""}
            className={`${inputClass} cursor-pointer bg-zinc-800`}
          >
            {AVAILABILITY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          <input
            type="text"
            name="location"
            defaultValue={location ?? ""}
            placeholder="Location"
            className={inputClass}
          />
        </div>
      </form>

      {profiles.length === 0 ? (
        <p className="text-center text-zinc-500">No profiles found. Try adjusting your search filters.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {profiles.map((profile: (typeof profiles)[number]) => (
            <ProfileCard key={profile.id} profile={profile} />
          ))}
        </div>
      )}
    </main>
  );
}
