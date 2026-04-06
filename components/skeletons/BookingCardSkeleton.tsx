"use client";

import { Skeleton } from "boneyard-js/react";

export function BookingCardSkeleton({ loading }: { loading: boolean }) {
  return (
    <Skeleton name="booking-card" loading={loading} color="#27272a" animate>
      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-zinc-800" />
            <div className="space-y-1">
              <div className="h-3 w-28 bg-zinc-800 rounded" />
              <div className="h-2 w-36 bg-zinc-800 rounded" />
            </div>
          </div>
          <div className="h-5 w-16 bg-zinc-800 rounded-full" />
        </div>
        <div className="h-2 w-40 bg-zinc-800 rounded" />
        <div className="flex gap-2">
          <div className="h-7 w-32 bg-zinc-800 rounded-lg" />
          <div className="h-7 w-16 bg-zinc-800 rounded-lg" />
        </div>
      </div>
    </Skeleton>
  );
}
