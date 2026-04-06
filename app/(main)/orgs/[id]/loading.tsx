import { BookingCardSkeleton } from "@/components/skeletons/BookingCardSkeleton";

export default function OrgDashboardLoading() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-8 space-y-8">
      {/* Heading */}
      <div className="flex items-center justify-between">
        <div className="h-8 w-48 bg-zinc-800 rounded animate-pulse" />
        <div className="h-3 w-28 bg-zinc-800 rounded animate-pulse" />
      </div>
      {/* Edit details card */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 space-y-4 animate-pulse">
        <div className="h-3 w-40 bg-zinc-800 rounded" />
        <div className="h-10 w-full bg-zinc-800 rounded-lg" />
        <div className="h-10 w-full bg-zinc-800 rounded-lg" />
        <div className="h-20 w-full bg-zinc-800 rounded-lg" />
        <div className="h-10 w-full bg-zinc-800 rounded-lg" />
      </div>
      {/* Services */}
      <div className="space-y-3">
        <div className="h-5 w-20 bg-zinc-800 rounded animate-pulse" />
        {Array.from({ length: 2 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 animate-pulse"
          >
            <div className="space-y-1">
              <div className="h-3 w-36 bg-zinc-800 rounded" />
              <div className="h-2 w-20 bg-zinc-800 rounded" />
            </div>
          </div>
        ))}
      </div>
      {/* Bookings */}
      <div className="space-y-3">
        <div className="h-5 w-24 bg-zinc-800 rounded animate-pulse" />
        {Array.from({ length: 3 }).map((_, i) => (
          <BookingCardSkeleton key={i} loading={true} />
        ))}
      </div>
    </main>
  );
}
