import Link from "next/link";

type Profile = { id: string; name: string; avatarUrl?: string | null };

export function Navbar({ profile }: { profile: Profile | null }) {
  return (
    <nav className="bg-zinc-900 border-b border-cyan-500/10 px-6 py-3 flex items-center gap-4">
      <Link
        href="/feed"
        className="font-bold text-lg text-white cursor-pointer shrink-0"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        Lime<span className="bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">L8</span>
      </Link>
      <form method="get" action="/search" className="flex-1 max-w-md">
        <input
          name="query"
          type="text"
          placeholder="Search artists..."
          className="w-full bg-zinc-800 border border-cyan-500/[0.27] rounded-lg px-3 py-1.5 text-sm text-zinc-300 placeholder:text-zinc-600 focus:border-cyan-500/[0.4] focus:outline-none shadow-[0_0_0_1px_rgba(34,211,238,0.13),0_0_12px_rgba(34,211,238,0.08)] focus:shadow-[0_0_0_1px_rgba(34,211,238,0.27),0_0_20px_rgba(34,211,238,0.16)]"
        />
      </form>
      <Link
        href="/messages"
        className="w-8 h-8 flex items-center justify-center bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-400 hover:text-white hover:border-cyan-500/40 transition-colors duration-200 cursor-pointer"
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
              className="w-8 h-8 rounded-full object-cover border-2 border-cyan-500/40 shadow-[0_0_8px_rgba(34,211,238,0.2)]"
            />
          ) : (
            <span className="w-8 h-8 rounded-full bg-cyan-950 border-2 border-cyan-500/40 text-cyan-400 flex items-center justify-center text-sm font-semibold shadow-[0_0_8px_rgba(34,211,238,0.2)]">
              {profile.name?.[0]?.toUpperCase() ?? "?"}
            </span>
          )}
        </Link>
      )}
    </nav>
  );
}
