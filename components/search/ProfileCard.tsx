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
      className="block rounded-xl border border-zinc-700 bg-zinc-800 p-4 hover:border-cyan-500/50 transition-all duration-200 cursor-pointer"
    >
      <div className="flex items-start gap-4">
        {profile.avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={profile.avatarUrl}
            alt={profile.name}
            className="h-14 w-14 rounded-full object-cover flex-shrink-0 border-2 border-zinc-600"
          />
        ) : (
          <div className="h-14 w-14 rounded-full bg-cyan-950 border border-cyan-500/25 flex items-center justify-center flex-shrink-0">
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
