import Link from "next/link";

type Profile = { id: string; name: string; avatarUrl?: string | null };

export function Navbar({ profile }: { profile: Profile | null }) {
  return (
    <nav className="bg-zinc-900 border-b border-zinc-700 px-6 py-3 flex items-center gap-4">
      <Link
        href="/feed"
        className="font-bold text-lg text-white cursor-pointer"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        Lime<span className="text-cyan-400">L8</span>
      </Link>
      <form method="get" action="/search" className="flex-1 max-w-md">
        <input
          name="query"
          type="text"
          placeholder="Search artists..."
          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-1.5 text-sm text-zinc-300 placeholder:text-zinc-600 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/20"
        />
      </form>
      <Link
        href="/messages"
        className="w-8 h-8 flex items-center justify-center bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-400 hover:text-white transition-colors cursor-pointer"
        aria-label="Messages"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
      </Link>
      {profile && (
        <Link
          href={`/profile/p_${profile.id}`}
          className="flex items-center gap-2 cursor-pointer"
        >
          {profile.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profile.avatarUrl}
              alt={profile.name}
              className="w-8 h-8 rounded-full object-cover border-2 border-cyan-500/40"
            />
          ) : (
            <span className="w-8 h-8 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-400 flex items-center justify-center text-sm font-semibold">
              {profile.name?.[0]?.toUpperCase() ?? "?"}
            </span>
          )}
        </Link>
      )}
    </nav>
  );
}
