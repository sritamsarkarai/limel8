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
      {group.bannerUrl && (
        <div className="h-40 rounded-xl overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={group.bannerUrl}
            alt="Group banner"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div>
        <h1 className="text-2xl font-bold">{group.name}</h1>
        {group.description && (
          <p className="text-gray-700 mt-2 whitespace-pre-wrap">
            {group.description}
          </p>
        )}
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2">
          Members ({group.members.length})
        </h2>
        <ul className="space-y-2">
          {group.members.map((member) => (
            <li key={member.profileId} className="flex items-center gap-3">
              {member.profile.avatarUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={member.profile.avatarUrl}
                  alt={member.profile.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
              )}
              <span className="text-sm font-medium">{member.profile.name}</span>
              {member.profileId === group.adminId && (
                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">
                  Admin
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>

      {group.posts.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-2">Posts</h2>
          <ul className="space-y-3">
            {group.posts.map((post) => (
              <li key={post.id} className="border rounded-lg p-3">
                <p className="text-gray-800 whitespace-pre-wrap">{post.content}</p>
                <p className="text-xs text-gray-400 mt-1">
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
