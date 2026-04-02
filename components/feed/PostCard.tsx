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
    <article className="rounded-xl border border-cyan-500/[0.27] bg-zinc-900 p-4 shadow-[0_0_0_1px_rgba(34,211,238,0.13),0_0_20px_rgba(34,211,238,0.13),0_0_40px_rgba(34,211,238,0.05)]">
      <div className="mb-3 flex items-center gap-3">
        {avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={avatarUrl}
            alt={authorName}
            className="h-10 w-10 rounded-full object-cover border-2 border-cyan-500/40 shadow-[0_0_8px_rgba(34,211,238,0.2)]"
          />
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-950 border border-cyan-500/40 text-sm font-semibold text-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.2)]">
            {authorName.charAt(0).toUpperCase()}
          </div>
        )}
        <div>
          <p className="font-semibold text-white">{authorName}</p>
          <time className="text-xs text-zinc-500">
            {new Date(post.createdAt).toLocaleDateString(undefined, {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </time>
        </div>
      </div>
      <p className="whitespace-pre-wrap text-zinc-300 text-sm leading-relaxed">{post.content}</p>
      {post.mediaUrls && post.mediaUrls.length > 0 && (
        <div className="mt-3 grid gap-2" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))" }}>
          {post.mediaUrls.map((url: string, index: number) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={index}
              src={url}
              alt={`Media ${index + 1}`}
              className="w-full rounded-lg object-cover border border-cyan-500/[0.27]"
            />
          ))}
        </div>
      )}
    </article>
  );
}
