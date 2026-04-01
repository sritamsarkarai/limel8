"use client";

import { useState } from "react";
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
    instagramUrl?: string | null;
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
  const [instagramUrl, setInstagramUrl] = useState(initial.instagramUrl ?? "");
  const [youtubeUrl, setYoutubeUrl] = useState(initial.youtubeUrl ?? "");
  const [spotifyUrl, setSpotifyUrl] = useState(initial.spotifyUrl ?? "");
  const [soundcloudUrl, setSoundcloudUrl] = useState(initial.soundcloudUrl ?? "");
  const [websiteUrl, setWebsiteUrl] = useState(initial.websiteUrl ?? "");

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
          instagramUrl: instagramUrl.trim() || null,
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
