"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Profile = { id: string };

const NAV_LINKS = [
  {
    href: "/feed",
    label: "Feed",
    icon: (
      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
  },
  {
    href: "/search",
    label: "Discover",
    icon: (
      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
      </svg>
    ),
  },
  {
    href: "/marketplace",
    label: "Marketplace",
    icon: (
      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/>
      </svg>
    ),
  },
  {
    href: "/messages",
    label: "Messages",
    icon: (
      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    ),
  },
  {
    href: "/settings/subscription",
    label: "Subscription",
    icon: (
      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/>
      </svg>
    ),
  },
];

export function Sidebar({ profile }: { profile: Profile | null }) {
  const pathname = usePathname();

  return (
    <aside className="w-56 border-r border-cyan-500/10 bg-zinc-900 p-3 space-y-1">
      {NAV_LINKS.map(({ href, label, icon }) => {
        const isActive = pathname === href || pathname.startsWith(href + "/");
        return (
          <Link
            key={href}
            href={href}
            className={`relative flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors duration-200 cursor-pointer ${
              isActive
                ? "bg-cyan-950/40 text-cyan-400 border border-cyan-500/[0.27] shadow-[0_0_0_1px_rgba(34,211,238,0.13),0_0_12px_rgba(34,211,238,0.08)]"
                : "text-zinc-400 hover:bg-zinc-800 hover:text-white border border-transparent"
            }`}
          >
            {isActive && (
              <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-3/5 bg-cyan-400 rounded-r shadow-[0_0_6px_#22d3ee]" />
            )}
            {icon}
            {label}
          </Link>
        );
      })}
      {profile && (
        <>
          <Link
            href={`/profile/p_${profile.id}`}
            className={`relative flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors duration-200 cursor-pointer ${
              pathname.startsWith("/profile")
                ? "bg-cyan-950/40 text-cyan-400 border border-cyan-500/[0.27] shadow-[0_0_0_1px_rgba(34,211,238,0.13),0_0_12px_rgba(34,211,238,0.08)]"
                : "text-zinc-400 hover:bg-zinc-800 hover:text-white border border-transparent"
            }`}
          >
            {pathname.startsWith("/profile") && (
              <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-3/5 bg-cyan-400 rounded-r shadow-[0_0_6px_#22d3ee]" />
            )}
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
            </svg>
            My Profile
          </Link>
          <Link
            href="/settings/profile"
            className={`relative flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors duration-200 cursor-pointer ${
              pathname === "/settings/profile"
                ? "bg-cyan-950/40 text-cyan-400 border border-cyan-500/[0.27] shadow-[0_0_0_1px_rgba(34,211,238,0.13),0_0_12px_rgba(34,211,238,0.08)]"
                : "text-zinc-400 hover:bg-zinc-800 hover:text-white border border-transparent"
            }`}
          >
            {pathname === "/settings/profile" && (
              <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-3/5 bg-cyan-400 rounded-r shadow-[0_0_6px_#22d3ee]" />
            )}
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
            Edit Profile
          </Link>
        </>
      )}
    </aside>
  );
}
