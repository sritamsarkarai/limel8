"use client";

import { Skeleton } from "boneyard-js/react";

export function ListingCardSkeleton({ loading }: { loading: boolean }) {
  return (
    <Skeleton name="listing-card" loading={loading} color="#27272a" animate>
      <div className="rounded-xl border border-zinc-800 bg-zinc-900 overflow-hidden">
        <div className="aspect-square w-full bg-zinc-800" />
        <div className="p-3 space-y-2">
          <div className="h-3 w-3/4 bg-zinc-800 rounded" />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-zinc-800" />
              <div className="h-2 w-20 bg-zinc-800 rounded" />
            </div>
            <div className="h-3 w-12 bg-zinc-800 rounded" />
          </div>
          <div className="h-4 w-16 bg-zinc-800 rounded-full" />
        </div>
      </div>
    </Skeleton>
  );
}
