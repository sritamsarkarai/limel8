export default function PublicOrgLoading() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      {/* Banner */}
      <div className="h-36 rounded-2xl bg-zinc-800 animate-pulse" />
      {/* Avatar + info */}
      <div className="flex items-start gap-4 -mt-10 px-2">
        <div className="w-20 h-20 rounded-xl bg-zinc-800 border-4 border-zinc-950 shrink-0 animate-pulse" />
        <div className="flex-1 mt-10 space-y-2">
          <div className="h-6 w-48 bg-zinc-800 rounded animate-pulse" />
          <div className="h-3 w-28 bg-zinc-800 rounded animate-pulse" />
          <div className="h-2 w-20 bg-zinc-800 rounded animate-pulse" />
        </div>
      </div>
      {/* Services */}
      <div className="space-y-3">
        <div className="h-5 w-20 bg-zinc-800 rounded animate-pulse" />
        {Array.from({ length: 2 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-4 animate-pulse"
          >
            <div className="space-y-1.5">
              <div className="h-3 w-40 bg-zinc-800 rounded" />
              <div className="h-2 w-24 bg-zinc-800 rounded" />
            </div>
            <div className="h-9 w-16 bg-zinc-800 rounded-lg shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}
