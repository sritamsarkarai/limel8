import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getProfileByUserId } from "@/modules/profiles/queries";
import { getFeedForUser } from "@/modules/feed/queries";
import { PostCard } from "@/components/feed/PostCard";

export default async function FeedPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/login");
  }

  const profile = await getProfileByUserId(session.user.id);
  if (!profile) {
    redirect("/login");
  }

  const posts = await getFeedForUser(profile.id);

  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent" style={{ fontFamily: "var(--font-heading)" }}>Your Feed</h1>
      {posts.length === 0 ? (
        <p className="text-center text-zinc-500">
          No posts yet. Follow some profiles or groups to see their posts here.
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {posts.map((post: (typeof posts)[number]) => (
            <PostCard key={post.id} post={post} currentProfileId={profile.id} />
          ))}
        </div>
      )}
    </main>
  );
}
