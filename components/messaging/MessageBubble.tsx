interface MessageBubbleProps {
  message: {
    id: string;
    content: string;
    createdAt: string | Date;
    senderId: string;
  };
  currentProfileId: string;
}

export function MessageBubble({ message, currentProfileId }: MessageBubbleProps) {
  const isSent = message.senderId === currentProfileId;
  const timestamp = new Date(message.createdAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className={`flex ${isSent ? "justify-end" : "justify-start"} mb-2`}>
      <div
        className={`max-w-xs rounded-xl px-4 py-2.5 text-sm ${
          isSent
            ? "bg-cyan-500 text-zinc-950"
            : "bg-zinc-800 text-zinc-200 border border-zinc-700"
        }`}
      >
        <p>{message.content}</p>
        <p className={`mt-1 text-xs ${isSent ? "text-cyan-900" : "text-zinc-500"}`}>
          {timestamp}
        </p>
      </div>
    </div>
  );
}
