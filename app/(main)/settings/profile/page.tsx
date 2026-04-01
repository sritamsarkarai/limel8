import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getProfileByUserId } from "@/modules/profiles/queries";
import { ProfileEditForm } from "@/components/profiles/ProfileEditForm";

export default async function EditProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const profile = await getProfileByUserId(session.user.id);
  if (!profile) redirect("/login");

  return (
    <main className="mx-auto max-w-xl px-4 py-8">
      <h1
        className="mb-6 text-2xl font-bold text-white"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        Edit Profile
      </h1>
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
        <ProfileEditForm
          profileId={profile.id}
          initial={{
            name: profile.name,
            bio: profile.bio,
            artistType: profile.artistType,
            location: profile.location,
            availabilityStatus: profile.availabilityStatus,
            instagramUrl: profile.instagramUrl,
            youtubeUrl: profile.youtubeUrl,
            spotifyUrl: profile.spotifyUrl,
            soundcloudUrl: profile.soundcloudUrl,
            websiteUrl: profile.websiteUrl,
          }}
        />
      </div>
    </main>
  );
}
