import { searchProfiles } from "@/modules/search/queries";
import { ProfileCard } from "@/components/search/ProfileCard";

const AVAILABILITY_OPTIONS = [
  { value: "", label: "Any availability" },
  { value: "available_for_hire", label: "Available for Hire" },
  { value: "open_to_collab", label: "Open to Collab" },
  { value: "open_to_join", label: "Open to Join" },
  { value: "not_available", label: "Not Available" },
];

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
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Discover Artists</h1>

      <form method="get" action="/search" className="mb-8 space-y-4">
        <div className="flex gap-2">
          <input
            type="text"
            name="query"
            defaultValue={query ?? ""}
            placeholder="Search by name, bio, or artist type..."
            className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
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
            className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <select
            name="availability"
            defaultValue={availability ?? ""}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </form>

      {profiles.length === 0 ? (
        <p className="text-center text-gray-500">No profiles found. Try adjusting your search filters.</p>
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
