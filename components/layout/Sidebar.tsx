import Link from "next/link";

type Profile = { id: string };

const NAV_LINKS = [
  { href: "/feed", label: "Feed" },
  { href: "/search", label: "Search" },
  { href: "/marketplace", label: "Marketplace" },
  { href: "/messages", label: "Messages" },
  { href: "/settings/subscription", label: "Subscription" },
];

export function Sidebar({ profile }: { profile: Profile | null }) {
  return (
    <aside className="w-56 border-r bg-gray-50 p-4 space-y-1">
      {NAV_LINKS.map(({ href, label }) => (
        <Link key={href} href={href} className="block px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-200">
          {label}
        </Link>
      ))}
      {profile && (
        <Link href={`/profile/p_${profile.id}`} className="block px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-200">
          My Profile
        </Link>
      )}
    </aside>
  );
}
