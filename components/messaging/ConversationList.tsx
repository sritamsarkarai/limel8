import Link from "next/link";

interface Conversation {
  id: string;
  content: string;
  createdAt: string | Date;
  sender: { id: string; name: string; avatarUrl?: string | null };
  recipient: { id: string; name: string; avatarUrl?: string | null };
}

interface ConversationListProps {
  conversations: Conversation[];
  currentProfileId: string;
}

export function ConversationList({ conversations, currentProfileId }: ConversationListProps) {
  if (conversations.length === 0) {
    return (
      <p className="py-16 text-center text-zinc-500">
        No conversations yet.
      </p>
    );
  }

  return (
    <ul className="divide-y divide-zinc-800">
      {conversations.map((convo) => {
        const otherProfile =
          convo.sender.id === currentProfileId ? convo.recipient : convo.sender;

        return (
          <li key={convo.id}>
            <Link
              href={`/messages/${otherProfile.id}`}
              className="flex items-center gap-3 px-4 py-3 hover:bg-zinc-800 transition-colors duration-200 cursor-pointer"
            >
              {otherProfile.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={otherProfile.avatarUrl}
                  alt={otherProfile.name}
                  className="h-10 w-10 rounded-full object-cover border border-zinc-600"
                />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-950 border border-cyan-500/25 text-sm font-semibold text-cyan-400">
                  {otherProfile.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-white text-sm">{otherProfile.name}</p>
                <p className="truncate text-sm text-zinc-500">{convo.content}</p>
              </div>
              <p className="text-xs text-zinc-600">
                {new Date(convo.createdAt).toLocaleDateString()}
              </p>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
