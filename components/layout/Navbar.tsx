import Link from "next/link";
import { ProfileDropdown } from "./ProfileDropdown";

type Profile = { id: string; name: string; avatarUrl?: string | null };

export function Navbar({ profile }: { profile: Profile | null }) {
  return (
    <nav className="bg-zinc-900 border-b border-cyan-500/10 px-4 py-3 flex items-center gap-3">
      <Link
        href="/feed"
        className="font-bold text-lg text-white cursor-pointer shrink-0"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        Lime<span className="bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">L8</span>
      </Link>

      {/* Search — hidden on mobile, visible from md up */}
      <form method="get" action="/search" className="hidden md:block flex-1 max-w-md">
        <input
          name="query"
          type="text"
          placeholder="Search artists..."
          className="w-full bg-zinc-800 border border-cyan-500/[0.27] rounded-lg px-3 py-1.5 text-sm text-zinc-300 placeholder:text-zinc-600 focus:border-cyan-500/[0.4] focus:outline-none shadow-[0_0_0_1px_rgba(34,211,238,0.13),0_0_12px_rgba(34,211,238,0.08)] focus:shadow-[0_0_0_1px_rgba(34,211,238,0.27),0_0_20px_rgba(34,211,238,0.16)]"
        />
      </form>

      {/* Spacer on mobile */}
      <div className="flex-1 md:hidden" />

      {/* Search icon on mobile — links to /search */}
      <Link
        href="/search"
        className="md:hidden w-8 h-8 flex items-center justify-center bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-400 hover:text-white hover:border-cyan-500/40 transition-colors duration-200 cursor-pointer"
        aria-label="Search"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
      </Link>

      <Link
        href="/messages"
        className="w-8 h-8 flex items-center justify-center bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-400 hover:text-white hover:border-cyan-500/40 transition-colors duration-200 cursor-pointer"
        aria-label="Messages"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
      </Link>

      {profile && <ProfileDropdown profile={profile} />}
    </nav>
  );
}
