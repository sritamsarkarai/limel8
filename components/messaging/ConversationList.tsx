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
      <p className="py-16 text-center text-gray-500">
        No conversations yet.
      </p>
    );
  }

  return (
    <ul className="divide-y divide-gray-200">
      {conversations.map((convo) => {
        const otherProfile =
          convo.sender.id === currentProfileId ? convo.recipient : convo.sender;

        return (
          <li key={convo.id}>
            <Link
              href={`/messages/${otherProfile.id}`}
              className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50"
            >
              {otherProfile.avatarUrl ? (
                <img
                  src={otherProfile.avatarUrl}
                  alt={otherProfile.name}
                  className="h-10 w-10 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-sm font-medium text-gray-600">
                  {otherProfile.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-gray-900">{otherProfile.name}</p>
                <p className="truncate text-sm text-gray-500">{convo.content}</p>
              </div>
              <p className="text-xs text-gray-400">
                {new Date(convo.createdAt).toLocaleDateString()}
              </p>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
