import Link from "next/link";
import { AvailabilityBadge } from "./AvailabilityBadge";
import { PostComposer } from "@/components/feed/PostComposer";
import { PostCard } from "@/components/feed/PostCard";

type SocialLinks = {
  instagramUrl?: string | null;
  facebookUrl?: string | null;
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
  mediaUrls?: string[];
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

const SOCIAL_ICONS: Record<string, React.ReactNode> = {
  Instagram: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  ),
  Facebook: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#1877F2" aria-hidden="true">
      <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073c0 6.027 4.388 11.024 10.125 11.927v-8.437H7.078v-3.49h3.047V9.43c0-3.007 1.792-4.669 4.532-4.669 1.312 0 2.686.234 2.686.234v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.49h-2.796v8.437C19.612 23.097 24 18.1 24 12.073z"/>
    </svg>
  ),
  Spotify: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#1DB954" aria-hidden="true">
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
    </svg>
  ),
  SoundCloud: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#FF5500" aria-hidden="true">
      <path d="M1.175 12.225c-.015 0-.03.001-.044.003C.504 12.331 0 12.87 0 13.528v.031C0 14.225.52 14.8 1.175 14.8h.021V12.22l-.021.005zm2.062-2.1a.832.832 0 0 0-.837.836v4.108a.832.832 0 0 0 .837.836.832.832 0 0 0 .837-.836v-4.108a.832.832 0 0 0-.837-.836zm2.084-.684a.832.832 0 0 0-.837.836v5.476a.832.832 0 0 0 .837.836.832.832 0 0 0 .837-.836V10.277a.832.832 0 0 0-.837-.836zm2.083-.384a.832.832 0 0 0-.836.836v6.236a.832.832 0 0 0 .836.836.832.832 0 0 0 .837-.836V9.893a.832.832 0 0 0-.837-.836zm2.085-.1a.832.832 0 0 0-.837.836v6.636a.832.832 0 0 0 .837.836.832.832 0 0 0 .836-.836V9.757a.832.832 0 0 0-.836-.836zm2.083 1.06a.832.832 0 0 0-.836.836v5.576a.832.832 0 0 0 .836.836.832.832 0 0 0 .837-.836v-5.576a.832.832 0 0 0-.837-.836zm2.085-1.44A5.555 5.555 0 0 0 8.12 9.593c-.042 0-.08.005-.12.008v5.985c0 .461.374.836.836.836h6.636A5.555 5.555 0 0 0 21.027 10.86a5.555 5.555 0 0 0-5.45-5.483z"/>
    </svg>
  ),
  YouTube: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#FF0000" aria-hidden="true">
      <path d="M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/>
    </svg>
  ),
  Website: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
    </svg>
  ),
};

export function IndividualProfileView({ profile, currentProfileId }: { profile: Profile; currentProfileId?: string | null }) {  const socialLinks = [
    { label: "Instagram", url: profile.instagramUrl },
    { label: "Facebook", url: profile.facebookUrl },
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
                className="text-xs font-bold text-zinc-950 bg-gradient-to-r from-cyan-400 to-violet-400 px-3 py-1 rounded-lg transition-opacity hover:opacity-90 cursor-pointer shadow-[0_0_8px_rgba(34,211,238,0.2)]"
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
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-300 hover:text-white border border-cyan-500/[0.27] bg-zinc-900 px-3 py-1.5 rounded-lg shadow-[0_0_0_1px_rgba(34,211,238,0.13),0_0_8px_rgba(34,211,238,0.08)] transition-colors duration-200 cursor-pointer"
                >
                  {SOCIAL_ICONS[label]}
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
                className="border border-cyan-500/[0.27] bg-zinc-900 rounded-xl p-3 space-y-1 shadow-[0_0_0_1px_rgba(34,211,238,0.13),0_0_12px_rgba(34,211,238,0.08)]"
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
      <div>
        <h2 className="text-base font-semibold text-white mb-3" style={{ fontFamily: "var(--font-heading)" }}>Posts</h2>
        {currentProfileId === profile.id && (
          <div className="mb-4">
            <PostComposer />
          </div>
        )}
        {profile.posts && profile.posts.length > 0 ? (
          <div className="space-y-3">
            {profile.posts.map((post) => (
              <PostCard
                key={post.id}
                post={{
                  ...post,
                  profile: { name: profile.name, avatarUrl: profile.avatarUrl },
                }}
              />
            ))}
          </div>
        ) : (
          <p className="text-sm text-zinc-500">No posts yet.</p>
        )}
      </div>
    </div>
  );
}
