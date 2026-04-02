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
        className="mb-6 text-2xl font-bold bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        Edit Profile
      </h1>
      <div className="rounded-2xl border border-cyan-500/[0.27] bg-zinc-900 p-6 shadow-[0_0_0_1px_rgba(34,211,238,0.13),0_0_20px_rgba(34,211,238,0.13),0_0_40px_rgba(34,211,238,0.05)]">
        <ProfileEditForm
          profileId={profile.id}
          initial={{
            name: profile.name,
            bio: profile.bio,
            artistType: profile.artistType,
            location: profile.location,
            availabilityStatus: profile.availabilityStatus,
            avatarUrl: profile.avatarUrl,
            bannerUrl: profile.bannerUrl,
            instagramUrl: profile.instagramUrl,
            facebookUrl: profile.facebookUrl,
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
