import Link from "next/link";
import { AvailabilityBadge } from "./AvailabilityBadge";

type SocialLinks = {
  instagramUrl?: string | null;
  spotifyUrl?: string | null;
  soundcloudUrl?: string | null;
  youtubeUrl?: string | null;
  websiteUrl?: string | null;
};

type Listing = {
  id: string;
  title: string;
  price: { toString(): string };
  type: string;
  status: string;
};

type Post = {
  id: string;
  content: string;
  createdAt: Date;
};

type Profile = {
  id: string;
  name: string;
  bio?: string | null;
  artistType?: string | null;
  location?: string | null;
  availabilityStatus: string;
  avatarUrl?: string | null;
  bannerUrl?: string | null;
  listings: Listing[];
  posts?: Post[];
} & SocialLinks;

export function IndividualProfileView({ profile, currentProfileId }: { profile: Profile; currentProfileId?: string | null }) {
  const socialLinks = [
    { label: "Instagram", url: profile.instagramUrl },
    { label: "Spotify", url: profile.spotifyUrl },
    { label: "SoundCloud", url: profile.soundcloudUrl },
    { label: "YouTube", url: profile.youtubeUrl },
    { label: "Website", url: profile.websiteUrl },
  ].filter((l) => l.url);

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      {/* Banner */}
      <div className="h-40 rounded-2xl overflow-hidden bg-gradient-to-br from-cyan-950 via-sky-900 to-cyan-900">
        {profile.bannerUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={profile.bannerUrl}
            alt="Profile banner"
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* Avatar + info */}
      <div className="flex items-start gap-4 -mt-10 px-2">
        {profile.avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={profile.avatarUrl}
            alt={profile.name}
            className="w-20 h-20 rounded-full object-cover border-4 border-zinc-950 shadow-lg flex-shrink-0"
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-cyan-950 border-4 border-zinc-950 flex items-center justify-center flex-shrink-0">
            <span className="text-2xl font-bold text-cyan-400">{profile.name.charAt(0).toUpperCase()}</span>
          </div>
        )}
        <div className="flex-1 space-y-1 mt-10">
          <div className="flex items-center gap-3 flex-wrap">
            <h1
              className="text-2xl font-bold text-white"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {profile.name}
            </h1>
            {currentProfileId === profile.id && (
              <Link
                href="/settings/profile"
                className="text-xs font-medium text-zinc-400 hover:text-white border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 px-3 py-1 rounded-lg transition-colors duration-200 cursor-pointer"
              >
                Edit Profile
              </Link>
            )}
          </div>
          {profile.artistType && (
            <p className="text-sm text-zinc-400">{profile.artistType}</p>
          )}
          {profile.location && (
            <p className="text-sm text-zinc-500">{profile.location}</p>
          )}
          <div className="pt-1">
            <AvailabilityBadge status={profile.availabilityStatus} />
          </div>
        </div>
      </div>

      {/* Bio */}
      {profile.bio && (
        <div>
          <h2 className="text-base font-semibold text-white mb-1" style={{ fontFamily: "var(--font-heading)" }}>Bio</h2>
          <p className="text-zinc-400 whitespace-pre-wrap text-sm leading-relaxed">{profile.bio}</p>
        </div>
      )}

      {/* Social links */}
      {socialLinks.length > 0 && (
        <div>
          <h2 className="text-base font-semibold text-white mb-2" style={{ fontFamily: "var(--font-heading)" }}>Links</h2>
          <ul className="flex flex-wrap gap-2">
            {socialLinks.map(({ label, url }) => (
              <li key={label}>
                <a
                  href={url!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-medium text-cyan-400 hover:text-cyan-300 border border-zinc-700 bg-zinc-800 px-3 py-1.5 rounded-lg transition-colors duration-200 cursor-pointer"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Listings */}
      {profile.listings.length > 0 && (
        <div>
          <h2 className="text-base font-semibold text-white mb-3" style={{ fontFamily: "var(--font-heading)" }}>Listings</h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {profile.listings.map((listing) => (
              <li
                key={listing.id}
                className="border border-zinc-700 bg-zinc-800 rounded-xl p-3 space-y-1"
              >
                <p className="font-medium text-white text-sm">{listing.title}</p>
                <p className="text-xs text-zinc-500 capitalize">{listing.type}</p>
                <p className="text-sm font-bold text-cyan-400">${listing.price.toString()}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Posts */}
      {profile.posts && profile.posts.length > 0 && (
        <div>
          <h2 className="text-base font-semibold text-white mb-3" style={{ fontFamily: "var(--font-heading)" }}>Posts</h2>
          <ul className="space-y-3">
            {profile.posts.map((post) => (
              <li key={post.id} className="border border-zinc-700 bg-zinc-800 rounded-xl p-4">
                <p className="text-zinc-300 whitespace-pre-wrap text-sm leading-relaxed">{post.content}</p>
                <p className="text-xs text-zinc-600 mt-2">
                  {new Date(post.createdAt).toLocaleDateString()}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
