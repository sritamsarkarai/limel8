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

export function IndividualProfileView({ profile }: { profile: Profile }) {
  const socialLinks = [
    { label: "Instagram", url: profile.instagramUrl },
    { label: "Spotify", url: profile.spotifyUrl },
    { label: "SoundCloud", url: profile.soundcloudUrl },
    { label: "YouTube", url: profile.youtubeUrl },
    { label: "Website", url: profile.websiteUrl },
  ].filter((l) => l.url);

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      {profile.bannerUrl && (
        <div className="h-40 rounded-xl overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={profile.bannerUrl}
            alt="Profile banner"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="flex items-start gap-4">
        {profile.avatarUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={profile.avatarUrl}
            alt={profile.name}
            className="w-20 h-20 rounded-full object-cover border-2 border-white shadow"
          />
        )}
        <div className="flex-1 space-y-1">
          <h1 className="text-2xl font-bold">{profile.name}</h1>
          {profile.artistType && (
            <p className="text-sm text-gray-500">{profile.artistType}</p>
          )}
          {profile.location && (
            <p className="text-sm text-gray-400">{profile.location}</p>
          )}
          <AvailabilityBadge status={profile.availabilityStatus} />
        </div>
      </div>

      {profile.bio && (
        <div>
          <h2 className="text-lg font-semibold mb-1">Bio</h2>
          <p className="text-gray-700 whitespace-pre-wrap">{profile.bio}</p>
        </div>
      )}

      {socialLinks.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-2">Links</h2>
          <ul className="flex flex-wrap gap-3">
            {socialLinks.map(({ label, url }) => (
              <li key={label}>
                <a
                  href={url!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-sm"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {profile.listings.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-2">Listings</h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {profile.listings.map((listing) => (
              <li
                key={listing.id}
                className="border rounded-lg p-3 space-y-1"
              >
                <p className="font-medium">{listing.title}</p>
                <p className="text-sm text-gray-500 capitalize">{listing.type}</p>
                <p className="text-sm font-semibold">${listing.price.toString()}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {profile.posts && profile.posts.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-2">Posts</h2>
          <ul className="space-y-3">
            {profile.posts.map((post) => (
              <li key={post.id} className="border rounded-lg p-3">
                <p className="text-gray-800 whitespace-pre-wrap">{post.content}</p>
                <p className="text-xs text-gray-400 mt-1">
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
