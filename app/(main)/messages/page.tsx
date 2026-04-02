import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getProfileByUserId } from "@/modules/profiles/queries";
import { getConversations } from "@/modules/messaging/queries";
import { ConversationList } from "@/components/messaging/ConversationList";

export default async function MessagesPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/login");
  }

  const profile = await getProfileByUserId(session.user.id);
  if (!profile) {
    redirect("/login");
  }

  const conversations = await getConversations(profile.id);

  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent" style={{ fontFamily: "var(--font-heading)" }}>Messages</h1>
      <ConversationList conversations={conversations} currentProfileId={profile.id} />
    </main>
  );
}
