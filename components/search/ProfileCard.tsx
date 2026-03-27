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
      className="block rounded-lg border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-start gap-4">
        {profile.avatarUrl ? (
          <img
            src={profile.avatarUrl}
            alt={profile.name}
            className="h-14 w-14 rounded-full object-cover flex-shrink-0"
          />
        ) : (
          <div className="h-14 w-14 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
            <span className="text-xl font-semibold text-gray-500">
              {profile.name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">{profile.name}</h3>
          {profile.artistType && (
            <p className="text-sm text-gray-600 truncate">{profile.artistType}</p>
          )}
          {profile.location && (
            <p className="text-sm text-gray-500 truncate">{profile.location}</p>
          )}
          <div className="mt-2">
            <AvailabilityBadge status={profile.availabilityStatus} />
          </div>
        </div>
      </div>
    </Link>
  );
}
