type Profile = {
  id: string;
  name: string;
  avatarUrl?: string | null;
};

type Member = {
  profileId: string;
  profile: Profile;
  joinedAt: Date;
};

type Post = {
  id: string;
  content: string;
  createdAt: Date;
};

type Group = {
  id: string;
  name: string;
  description?: string | null;
  bannerUrl?: string | null;
  adminId: string;
  admin: Profile;
  members: Member[];
  posts: Post[];
};

export function GroupProfileView({ group }: { group: Group }) {
  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      {/* Banner */}
      <div className="h-40 rounded-2xl overflow-hidden bg-gradient-to-br from-cyan-950 via-sky-900 to-cyan-900">
        {group.bannerUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={group.bannerUrl}
            alt="Group banner"
            className="w-full h-full object-cover"
          />
        )}
      </div>

      <div>
        <h1
          className="text-2xl font-bold text-white"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          {group.name}
        </h1>
        {group.description && (
          <p className="text-zinc-400 mt-2 whitespace-pre-wrap text-sm leading-relaxed">
            {group.description}
          </p>
        )}
      </div>

      <div>
        <h2
          className="text-base font-semibold text-white mb-3"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Members ({group.members.length})
        </h2>
        <ul className="space-y-2">
          {group.members.map((member) => (
            <li key={member.profileId} className="flex items-center gap-3">
              {member.profile.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={member.profile.avatarUrl}
                  alt={member.profile.name}
                  className="w-8 h-8 rounded-full object-cover border border-zinc-600"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-cyan-950 border border-cyan-500/25 flex items-center justify-center text-xs font-semibold text-cyan-400">
                  {member.profile.name.charAt(0).toUpperCase()}
                </div>
              )}
              <span className="text-sm font-medium text-zinc-300">{member.profile.name}</span>
              {member.profileId === group.adminId && (
                <span className="text-xs bg-zinc-700 text-zinc-300 border border-zinc-600 px-2 py-0.5 rounded-full">
                  Admin
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>

      {group.posts.length > 0 && (
        <div>
          <h2
            className="text-base font-semibold text-white mb-3"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Posts
          </h2>
          <ul className="space-y-3">
            {group.posts.map((post) => (
              <li key={post.id} className="border border-zinc-700 bg-zinc-800 rounded-xl p-4">
                <p className="text-zinc-300 whitespace-pre-wrap text-sm leading-relaxed">{post.content}</p>
                <p className="text-xs text-zinc-600 mt-2">
                  {new Date(post.createdAt).toLocaleDateString()}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
