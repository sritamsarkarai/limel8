"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type Profile = { id: string };

type NavItem = {
  href: string;
  label: string;
  icon: React.ReactNode;
  iconActive?: React.ReactNode;
};

const MAIN_LINKS: NavItem[] = [
  {
    href: "/feed",
    label: "Feed",
    icon: (
      <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
    iconActive: (
      <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="currentColor" stroke="none">
        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
      </svg>
    ),
  },
  {
    href: "/search",
    label: "Discover",
    icon: (
      <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
      </svg>
    ),
    iconActive: (
      <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
      </svg>
    ),
  },
  {
    href: "/marketplace",
    label: "Marketplace",
    icon: (
      <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
      </svg>
    ),
    iconActive: (
      <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="currentColor" stroke="none">
        <path d="M19 6l-3-4H8L5 6H2v2h1l1 12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2l1-12h1V6h-3zm-7 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/>
      </svg>
    ),
  },
  {
    href: "/messages",
    label: "Messages",
    icon: (
      <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    ),
    iconActive: (
      <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="currentColor" stroke="none">
        <path d="M20 2H4a2 2 0 0 0-2 2v18l4-4h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z"/>
      </svg>
    ),
  },
  {
    href: "/orgs",
    label: "Organizations",
    icon: (
      <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
    iconActive: (
      <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="currentColor" stroke="none">
        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
      </svg>
    ),
  },
];

const SECONDARY_LINKS: NavItem[] = [
  {
    href: "/settings/subscription",
    label: "Subscription",
    icon: (
      <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/>
      </svg>
    ),
    iconActive: (
      <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="currentColor" stroke="none">
        <path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 5H4V7h16v2z"/>
      </svg>
    ),
  },
  {
    href: "/settings",
    label: "Settings",
    icon: (
      <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
      </svg>
    ),
  },
];

// Exported so Navbar can call it
export let sidebarToggle: (() => void) | null = null;

function NavLink({
  href,
  label,
  icon,
  iconActive,
  isActive,
  collapsed,
  profileMatch,
}: NavItem & { isActive: boolean; collapsed: boolean; profileMatch?: boolean }) {
  return (
    <Link
      href={href}
      title={collapsed ? label : undefined}
      className={`flex items-center gap-4 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors duration-150 cursor-pointer group ${
        isActive
          ? "bg-zinc-800 text-white"
          : "text-zinc-400 hover:bg-zinc-800/60 hover:text-white"
      } ${collapsed ? "justify-center px-0 py-3" : ""}`}
    >
      <span className={isActive ? "text-white" : "text-zinc-400 group-hover:text-white"}>
        {isActive && iconActive ? iconActive : icon}
      </span>
      {!collapsed && <span className={`truncate ${isActive ? "font-semibold" : ""}`}>{label}</span>}
    </Link>
  );
}

export function Sidebar({ profile }: { profile: Profile | null }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("sidebar-collapsed");
    if (stored !== null) setCollapsed(stored === "true");
  }, []);

  useEffect(() => {
    sidebarToggle = () =>
      setCollapsed((v) => {
        localStorage.setItem("sidebar-collapsed", String(!v));
        return !v;
      });
    return () => { sidebarToggle = null; };
  }, []);

  const profileHref = profile ? `/profile/p_${profile.id}` : "/feed";

  const profileLink: NavItem = {
    href: profileHref,
    label: "My Profile",
    icon: (
      <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
      </svg>
    ),
    iconActive: (
      <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="currentColor" stroke="none">
        <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
      </svg>
    ),
  };

  return (
    <>
      {/* ── Desktop sidebar ── */}
      <aside
        className="hidden md:flex flex-col bg-zinc-950 shrink-0 transition-all duration-300 overflow-hidden"
        style={{ width: collapsed ? "72px" : "240px" }}
      >
        <div className="flex-1 overflow-y-auto overflow-x-hidden py-3 px-2 space-y-0.5">
          {/* Main nav */}
          {MAIN_LINKS.map(({ href, label, icon, iconActive }) => {
            const isActive = pathname === href || pathname.startsWith(href + "/");
            return (
              <NavLink key={href} href={href} label={label} icon={icon} iconActive={iconActive} isActive={isActive} collapsed={collapsed} />
            );
          })}

          {/* Profile link */}
          {profile && (
            <NavLink
              {...profileLink}
              isActive={pathname.startsWith("/profile")}
              collapsed={collapsed}
            />
          )}

          {/* Divider */}
          <div className="my-2 border-t border-zinc-800" />

          {/* Secondary nav */}
          {SECONDARY_LINKS.map(({ href, label, icon, iconActive }) => {
            const isActive = pathname === href || pathname.startsWith(href + "/");
            return (
              <NavLink key={href} href={href} label={label} icon={icon} iconActive={iconActive} isActive={isActive} collapsed={collapsed} />
            );
          })}
        </div>
      </aside>

      {/* ── Mobile bottom tab bar ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 flex bg-zinc-900 border-t border-zinc-800">
        {[...MAIN_LINKS, ...(profile ? [profileLink] : [])].map(({ href, label, icon, iconActive }) => {
          const isActive =
            href === profileHref
              ? pathname.startsWith("/profile")
              : pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-1 flex-col items-center justify-center gap-0.5 py-2 text-[10px] font-medium transition-colors ${
                isActive ? "text-white" : "text-zinc-500"
              }`}
            >
              {isActive && iconActive ? iconActive : icon}
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
