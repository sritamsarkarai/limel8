"use client";

import Link from "next/link";
import { ProfileDropdown } from "./ProfileDropdown";
import { sidebarToggle } from "./Sidebar";

type Profile = { id: string; name: string; avatarUrl?: string | null };

function HamburgerIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="6" x2="21" y2="6"/>
      <line x1="3" y1="12" x2="21" y2="12"/>
      <line x1="3" y1="18" x2="21" y2="18"/>
    </svg>
  );
}

export function Navbar({ profile }: { profile: Profile | null }) {
  return (
    <nav className="sticky top-0 z-30 bg-zinc-950 border-b border-zinc-800 px-4 py-2 flex items-center gap-3 h-14">
      {/* Hamburger — toggles sidebar */}
      <button
        onClick={() => sidebarToggle?.()}
        className="w-9 h-9 flex items-center justify-center rounded-full text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors cursor-pointer shrink-0"
        aria-label="Toggle sidebar"
      >
        <HamburgerIcon />
      </button>

      {/* Logo */}
      <Link
        href="/feed"
        className="font-bold text-lg text-white cursor-pointer shrink-0 mr-2"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        Lime<span className="bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">L8</span>
      </Link>

      {/* Search bar — hidden on mobile */}
      <form method="get" action="/search" className="hidden md:flex flex-1 max-w-lg mx-auto">
        <div className="flex w-full rounded-full overflow-hidden border border-zinc-700 bg-zinc-900 focus-within:border-cyan-500/50 focus-within:shadow-[0_0_0_1px_rgba(34,211,238,0.2)] transition-all">
          <input
            name="query"
            type="text"
            placeholder="Search artists..."
            className="flex-1 bg-transparent px-4 py-2 text-sm text-zinc-300 placeholder:text-zinc-600 focus:outline-none"
          />
          <button
            type="submit"
            className="px-4 bg-zinc-800 border-l border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors cursor-pointer"
            aria-label="Search"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
          </button>
        </div>
      </form>

      {/* Right side */}
      <div className="ml-auto flex items-center gap-2">
        {/* Search icon on mobile */}
        <Link
          href="/search"
          className="md:hidden w-9 h-9 flex items-center justify-center rounded-full text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors cursor-pointer"
          aria-label="Search"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
        </Link>

        {/* Messages */}
        <Link
          href="/messages"
          className="w-9 h-9 flex items-center justify-center rounded-full text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors cursor-pointer"
          aria-label="Messages"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
        </Link>

        {profile && <ProfileDropdown profile={profile} />}
      </div>
    </nav>
  );
}
