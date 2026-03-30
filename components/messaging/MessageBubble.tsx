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
        className={`max-w-xs rounded-lg px-4 py-2 text-sm ${
          isSent
            ? "bg-blue-600 text-white"
            : "bg-gray-100 text-gray-900"
        }`}
      >
        <p>{message.content}</p>
        <p className={`mt-1 text-xs ${isSent ? "text-blue-200" : "text-gray-500"}`}>
          {timestamp}
        </p>
      </div>
    </div>
  );
}
