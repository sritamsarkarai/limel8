export default function ProfileSettingsLoading() {
  return (
    <main className="mx-auto max-w-xl px-4 py-8">
      <div className="mb-6 h-8 w-44 bg-zinc-800 rounded animate-pulse" />
      <div className="rounded-2xl border border-cyan-500/[0.27] bg-zinc-900 p-6 space-y-5 animate-pulse shadow-[0_0_0_1px_rgba(34,211,238,0.13),0_0_20px_rgba(34,211,238,0.13),0_0_40px_rgba(34,211,238,0.05)]">
        {/* Avatar upload */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-zinc-800" />
          <div className="h-9 w-32 bg-zinc-800 rounded-lg" />
        </div>
        {/* Fields */}
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="space-y-1">
            <div className="h-3 w-24 bg-zinc-800 rounded" />
            <div className="h-10 w-full bg-zinc-800 rounded-lg" />
          </div>
        ))}
        <div className="h-10 w-full bg-zinc-800 rounded-lg" />
      </div>
    </main>
  );
}
