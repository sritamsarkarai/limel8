"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

const AVAILABILITY_OPTIONS = [
  { value: "not_available", label: "Not Available" },
  { value: "available_for_hire", label: "Available for Hire" },
  { value: "open_to_collab", label: "Open to Collab" },
  { value: "open_to_join", label: "Open to Join" },
];

interface ProfileEditFormProps {
  profileId: string;
  initial: {
    name: string;
    bio?: string | null;
    artistType?: string | null;
    location?: string | null;
    availabilityStatus: string;
    avatarUrl?: string | null;
    bannerUrl?: string | null;
    instagramUrl?: string | null;
    facebookUrl?: string | null;
    youtubeUrl?: string | null;
    spotifyUrl?: string | null;
    soundcloudUrl?: string | null;
    websiteUrl?: string | null;
  };
}

export function ProfileEditForm({ profileId, initial }: ProfileEditFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [name, setName] = useState(initial.name ?? "");
  const [bio, setBio] = useState(initial.bio ?? "");
  const [artistType, setArtistType] = useState(initial.artistType ?? "");
  const [location, setLocation] = useState(initial.location ?? "");
  const [availabilityStatus, setAvailabilityStatus] = useState(initial.availabilityStatus ?? "not_available");
  const [avatarUrl, setAvatarUrl] = useState(initial.avatarUrl ?? "");
  const [bannerUrl, setBannerUrl] = useState(initial.bannerUrl ?? "");
  const [instagramUrl, setInstagramUrl] = useState(initial.instagramUrl ?? "");
  const [facebookUrl, setFacebookUrl] = useState(initial.facebookUrl ?? "");
  const [youtubeUrl, setYoutubeUrl] = useState(initial.youtubeUrl ?? "");
  const [spotifyUrl, setSpotifyUrl] = useState(initial.spotifyUrl ?? "");
  const [soundcloudUrl, setSoundcloudUrl] = useState(initial.soundcloudUrl ?? "");
  const [websiteUrl, setWebsiteUrl] = useState(initial.websiteUrl ?? "");

  const [avatarUploading, setAvatarUploading] = useState(false);
  const [bannerUploading, setBannerUploading] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  async function uploadImage(file: File, kind: "avatar" | "banner") {
    const setter = kind === "avatar" ? setAvatarUploading : setBannerUploading;
    setter(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("kind", kind);
      const res = await fetch("/api/upload/profile-image", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Upload failed");
      if (kind === "avatar") setAvatarUrl(data.url);
      else setBannerUrl(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setter(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch(`/api/profiles/p_${profileId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          bio: bio.trim() || null,
          artistType: artistType.trim() || null,
          location: location.trim() || null,
          availabilityStatus,
          avatarUrl: avatarUrl || null,
          bannerUrl: bannerUrl || null,
          instagramUrl: instagramUrl.trim() || null,
          facebookUrl: facebookUrl.trim() || null,
          youtubeUrl: youtubeUrl.trim() || null,
          spotifyUrl: spotifyUrl.trim() || null,
          soundcloudUrl: soundcloudUrl.trim() || null,
          websiteUrl: websiteUrl.trim() || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Failed to save profile");
        return;
      }

      setSuccess(true);
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const inputClass = "mt-1 block w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/20";
  const labelClass = "block text-sm font-medium text-zinc-300";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-lg bg-red-950 border border-red-800 p-3 text-sm text-red-400">{error}</div>
      )}
      {success && (
        <div className="rounded-lg bg-green-950 border border-green-800 p-3 text-sm text-green-400">Profile saved successfully.</div>
      )}

      {/* Photos */}
      <div className="space-y-4">
        <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider">Photos</h2>

        {/* Cover photo */}
        <div>
          <label className={labelClass}>Cover Photo</label>
          <div
            className="mt-1 relative h-28 rounded-xl overflow-hidden bg-zinc-800 border border-zinc-700 cursor-pointer group"
            onClick={() => bannerInputRef.current?.click()}
          >
            {bannerUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={bannerUrl} alt="Cover" className="w-full h-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center text-zinc-600 text-sm">Click to upload</div>
            )}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-sm font-medium">
              {bannerUploading ? "Uploading…" : "Change cover"}
            </div>
          </div>
          <input
            ref={bannerInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadImage(f, "banner"); }}
          />
        </div>

        {/* Avatar */}
        <div>
          <label className={labelClass}>Profile Picture</label>
          <div className="mt-1 flex items-center gap-4">
            <div
              className="relative w-20 h-20 rounded-full overflow-hidden bg-zinc-800 border border-zinc-700 cursor-pointer group flex-shrink-0"
              onClick={() => avatarInputRef.current?.click()}
            >
              {avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-zinc-600 text-xs">Photo</div>
              )}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-medium">
                {avatarUploading ? "…" : "Change"}
              </div>
            </div>
            <p className="text-xs text-zinc-500">Click the circle to upload. Max 5 MB.</p>
          </div>
          <input
            ref={avatarInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadImage(f, "avatar"); }}
          />
        </div>
      </div>

      {/* Basic info */}
      <div className="space-y-4">
        <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider">Basic Info</h2>

        <div>
          <label className={labelClass}>Name <span className="text-red-400">*</span></label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Artist Type</label>
          <input
            type="text"
            value={artistType}
            onChange={(e) => setArtistType(e.target.value)}
            placeholder="e.g. Musician, Photographer, Painter"
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Location</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. New York, NY"
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={4}
            placeholder="Tell people about yourself and your work..."
            className={inputClass + " resize-none"}
          />
        </div>

        <div>
          <label className={labelClass}>Availability</label>
          <select
            value={availabilityStatus}
            onChange={(e) => setAvailabilityStatus(e.target.value)}
            className={inputClass + " cursor-pointer"}
          >
            {AVAILABILITY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Social links */}
      <div className="space-y-4">
        <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider">Social Links</h2>

        <div>
          <label className={labelClass}>Instagram</label>
          <input
            type="url"
            value={instagramUrl}
            onChange={(e) => setInstagramUrl(e.target.value)}
            placeholder="https://instagram.com/yourhandle"
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Facebook</label>
          <input
            type="url"
            value={facebookUrl}
            onChange={(e) => setFacebookUrl(e.target.value)}
            placeholder="https://facebook.com/yourpage"
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>YouTube</label>
          <input
            type="url"
            value={youtubeUrl}
            onChange={(e) => setYoutubeUrl(e.target.value)}
            placeholder="https://youtube.com/@yourchannel"
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Spotify</label>
          <input
            type="url"
            value={spotifyUrl}
            onChange={(e) => setSpotifyUrl(e.target.value)}
            placeholder="https://open.spotify.com/artist/..."
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>SoundCloud</label>
          <input
            type="url"
            value={soundcloudUrl}
            onChange={(e) => setSoundcloudUrl(e.target.value)}
            placeholder="https://soundcloud.com/yourprofile"
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Website</label>
          <input
            type="url"
            value={websiteUrl}
            onChange={(e) => setWebsiteUrl(e.target.value)}
            placeholder="https://yourwebsite.com"
            className={inputClass}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-cyan-500 px-4 py-2 text-sm font-bold text-zinc-950 hover:bg-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 cursor-pointer"
      >
        {loading ? "Saving…" : "Save Profile"}
      </button>
    </form>
  );
}
