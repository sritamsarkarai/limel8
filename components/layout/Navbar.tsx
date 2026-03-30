import Link from "next/link";

type Profile = { id: string; name: string; avatarUrl?: string | null };

export function Navbar({ profile }: { profile: Profile | null }) {
  return (
    <nav className="bg-white border-b px-6 py-3 flex items-center gap-4">
      <Link href="/feed" className="font-bold text-lg text-blue-600">ArtistConnect</Link>
      <form method="get" action="/search" className="flex-1 max-w-md">
        <input
          name="query"
          type="text"
          placeholder="Search artists..."
          className="w-full border rounded-lg px-3 py-1.5 text-sm"
        />
      </form>
      <Link href="/messages" className="text-gray-600 hover:text-gray-900">💬</Link>
      {profile && (
        <Link href={`/profile/p_${profile.id}`} className="flex items-center gap-2">
          {profile.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={profile.avatarUrl} alt={profile.name} className="w-8 h-8 rounded-full object-cover" />
          ) : (
            <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-semibold">
              {profile.name[0].toUpperCase()}
            </span>
          )}
        </Link>
      )}
    </nav>
  );
}
