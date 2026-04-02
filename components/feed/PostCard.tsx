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

function getYouTubeId(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtube.com")) return u.searchParams.get("v");
    if (u.hostname === "youtu.be") return u.pathname.slice(1);
  } catch {
    // not a valid URL
  }
  return null;
}

function MediaItem({ url }: { url: string }) {
  const youtubeId = getYouTubeId(url);
  if (youtubeId) {
    return (
      <div className="aspect-video w-full overflow-hidden rounded-lg border border-cyan-500/[0.27]">
        <iframe
          src={`https://www.youtube.com/embed/${youtubeId}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
          title="YouTube video"
        />
      </div>
    );
  }

  const lower = url.toLowerCase().split("?")[0];
  if (/\.(mp4|webm|ogg|mov)/.test(lower)) {
    return (
      <video
        src={url}
        controls
        className="w-full rounded-lg border border-cyan-500/[0.27] max-h-80 object-contain bg-zinc-950"
      />
    );
  }

  if (/\.(mp3|wav|flac|aac|ogg|m4a)/.test(lower) || url.includes("soundcloud.com")) {
    if (url.includes("soundcloud.com")) {
      return (
        <iframe
          src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&color=%2322d3ee&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false`}
          height="80"
          className="w-full rounded-lg border border-cyan-500/[0.27]"
          title="SoundCloud track"
        />
      );
    }
    return (
      <audio
        src={url}
        controls
        className="w-full"
      />
    );
  }

  // Default: image
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={url}
      alt="Post media"
      className="w-full rounded-lg object-cover border border-cyan-500/[0.27] max-h-80"
    />
  );
}

export function PostCard({ post }: PostCardProps) {
  const authorName = post.profile?.name ?? post.group?.name ?? "Unknown";
  const avatarUrl = post.profile?.avatarUrl;
  const trimmedContent = post.content.trim();

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
      {trimmedContent && trimmedContent !== " " && (
        <p className="whitespace-pre-wrap text-zinc-300 text-sm leading-relaxed">{trimmedContent}</p>
      )}
      {post.mediaUrls && post.mediaUrls.length > 0 && (
        <div className={`mt-3 space-y-2 ${post.mediaUrls.length > 1 ? "grid grid-cols-1 gap-2" : ""}`}>
          {post.mediaUrls.map((url: string, index: number) => (
            <MediaItem key={index} url={url} />
          ))}
        </div>
      )}
    </article>
  );
}
