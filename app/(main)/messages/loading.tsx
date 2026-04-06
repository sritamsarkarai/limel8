import { ConversationItemSkeleton } from "@/components/skeletons/ConversationItemSkeleton";

export default function MessagesLoading() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-6 h-8 w-32 bg-zinc-800 rounded animate-pulse" />
      <div className="rounded-xl border border-zinc-800 bg-zinc-900 overflow-hidden">
        {Array.from({ length: 6 }).map((_, i) => (
          <ConversationItemSkeleton key={i} loading={true} />
        ))}
      </div>
    </main>
  );
}
