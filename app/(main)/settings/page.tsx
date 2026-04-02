import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";

const SETTINGS_SECTIONS = [
  {
    href: "/settings/profile",
    title: "Profile",
    description: "Edit your name, bio, artist type, location, and social links.",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
      </svg>
    ),
  },
  {
    href: "/settings/account",
    title: "Account",
    description: "Update your email address or change your password.",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>
      </svg>
    ),
  },
  {
    href: "/settings/security",
    title: "Security & Login",
    description: "Manage your password, active sessions, and two-factor authentication.",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
      </svg>
    ),
  },
  {
    href: "/settings/privacy",
    title: "Privacy & Safety",
    description: "Control who can see your profile, posts, and contact you.",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
  },
  {
    href: "/settings/notifications",
    title: "Notifications",
    description: "Choose what you're notified about — messages, follows, orders, and more.",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
      </svg>
    ),
  },
  {
    href: "/settings/subscription",
    title: "Subscription & Payments",
    description: "Manage your plan, view billing history, and update payment methods.",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/>
      </svg>
    ),
  },
  {
    href: "/settings/connected-accounts",
    title: "Connected Accounts",
    description: "Link or unlink Google, Facebook, and Stripe Connect.",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
      </svg>
    ),
  },
  {
    href: "/settings/help",
    title: "Help & Support",
    description: "Browse FAQs, report a problem, or contact support.",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
    ),
  },
];

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      <h1
        className="mb-6 text-2xl font-bold bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        Settings
      </h1>

      <div className="space-y-2">
        {SETTINGS_SECTIONS.map(({ href, title, description, icon }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-4 rounded-xl border border-cyan-500/[0.27] bg-zinc-900 px-4 py-4 shadow-[0_0_0_1px_rgba(34,211,238,0.13),0_0_12px_rgba(34,211,238,0.06)] hover:shadow-[0_0_0_1px_rgba(34,211,238,0.27),0_0_20px_rgba(34,211,238,0.13)] hover:border-cyan-500/40 transition-all duration-200 cursor-pointer group"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-zinc-800 text-zinc-400 group-hover:text-cyan-400 group-hover:bg-cyan-950/40 transition-colors duration-200 border border-zinc-700 group-hover:border-cyan-500/[0.27]">
              {icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white">{title}</p>
              <p className="text-xs text-zinc-500 mt-0.5">{description}</p>
            </div>
            <svg className="w-4 h-4 text-zinc-600 group-hover:text-zinc-400 shrink-0 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </Link>
        ))}
      </div>
    </main>
  );
}
