export default function ListingDetailLoading() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      {/* Back link placeholder */}
      <div className="mb-4 h-4 w-32 bg-zinc-800 rounded animate-pulse" />
      {/* Image grid placeholder */}
      <div className="mb-6 grid gap-2 sm:grid-cols-2">
        <div className="aspect-square w-full bg-zinc-800 rounded-lg animate-pulse" />
        <div className="aspect-square w-full bg-zinc-800 rounded-lg animate-pulse" />
      </div>
      {/* Info block */}
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="h-6 w-3/4 bg-zinc-800 rounded animate-pulse" />
          <div className="h-6 w-16 bg-zinc-800 rounded-full animate-pulse shrink-0" />
        </div>
        <div className="h-8 w-24 bg-zinc-800 rounded animate-pulse" />
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-zinc-800 animate-pulse" />
          <div className="h-3 w-32 bg-zinc-800 rounded animate-pulse" />
        </div>
        <div className="space-y-2">
          <div className="h-3 w-full bg-zinc-800 rounded animate-pulse" />
          <div className="h-3 w-5/6 bg-zinc-800 rounded animate-pulse" />
          <div className="h-3 w-4/6 bg-zinc-800 rounded animate-pulse" />
        </div>
        <div className="h-11 w-full bg-zinc-800 rounded-lg animate-pulse mt-4" />
      </div>
    </main>
  );
}
