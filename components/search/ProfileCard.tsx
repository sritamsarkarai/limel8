import Link from "next/link";
import { AvailabilityBadge } from "@/components/profiles/AvailabilityBadge";

interface ProfileCardProps {
  profile: {
    id: string;
    name: string;
    artistType?: string | null;
    location?: string | null;
    availabilityStatus: string;
    avatarUrl?: string | null;
  };
}

export function ProfileCard({ profile }: ProfileCardProps) {
  return (
    <Link
      href={`/profile/p_${profile.id}`}
      className="block rounded-xl border border-cyan-500/[0.27] bg-zinc-900 p-4 hover:border-cyan-500/[0.4] hover:-translate-y-0.5 shadow-[0_0_0_1px_rgba(34,211,238,0.13),0_0_20px_rgba(34,211,238,0.13),0_0_40px_rgba(34,211,238,0.05)] hover:shadow-[0_0_0_1px_rgba(34,211,238,0.27),0_0_20px_rgba(34,211,238,0.16),0_0_40px_rgba(34,211,238,0.06)] transition-all duration-200 cursor-pointer"
    >
      <div className="flex items-start gap-4">
        {profile.avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={profile.avatarUrl}
            alt={profile.name}
            className="h-14 w-14 rounded-full object-cover flex-shrink-0 border-2 border-cyan-500/40 shadow-[0_0_8px_rgba(34,211,238,0.2)]"
          />
        ) : (
          <div className="h-14 w-14 rounded-full bg-cyan-950 border border-cyan-500/40 flex items-center justify-center flex-shrink-0 shadow-[0_0_8px_rgba(34,211,238,0.2)]">
            <span className="text-xl font-semibold text-cyan-400">
              {profile.name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-white truncate">{profile.name}</h3>
          {profile.artistType && (
            <p className="text-sm text-zinc-400 truncate mt-0.5">{profile.artistType}</p>
          )}
          {profile.location && (
            <p className="text-sm text-zinc-500 truncate">{profile.location}</p>
          )}
          <div className="mt-2">
            <AvailabilityBadge status={profile.availabilityStatus} />
          </div>
        </div>
      </div>
    </Link>
  );
}
