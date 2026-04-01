type PostCardProps = {
  post: {
    id: string;
    content: string;
    createdAt: Date;
    mediaUrls?: string[] | null;
    profile?: { name: string; avatarUrl?: string | null } | null;
    group?: { name: string } | null;
  };
};

export function PostCard({ post }: PostCardProps) {
  const authorName = post.profile?.name ?? post.group?.name ?? "Unknown";
  const avatarUrl = post.profile?.avatarUrl;

  return (
    <article className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="mb-2 flex items-center gap-3">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={authorName}
            className="h-10 w-10 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-300 text-sm font-semibold text-gray-600">
            {authorName.charAt(0).toUpperCase()}
          </div>
        )}
        <div>
          <p className="font-semibold text-gray-900">{authorName}</p>
          <time className="text-xs text-gray-500">
            {new Date(post.createdAt).toLocaleDateString(undefined, {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </time>
        </div>
      </div>
      <p className="whitespace-pre-wrap text-gray-800">{post.content}</p>
      {post.mediaUrls && post.mediaUrls.length > 0 && (
        <div className="mt-3 grid gap-2" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))" }}>
          {post.mediaUrls.map((url: string, index: number) => (
            <img
              key={index}
              src={url}
              alt={`Media ${index + 1}`}
              className="w-full rounded-md object-cover"
            />
          ))}
        </div>
      )}
    </article>
  );
}
