"use client";

import { Skeleton } from "boneyard-js/react";

export function PostCardSkeleton({ loading }: { loading: boolean }) {
  return (
    <Skeleton name="post-card" loading={loading} color="#27272a" animate>
      {/* Real PostCard is rendered by the page when data is available */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-zinc-800" />
          <div className="flex-1 space-y-1">
            <div className="h-3 w-28 bg-zinc-800 rounded" />
            <div className="h-2 w-16 bg-zinc-800 rounded" />
          </div>
        </div>
        <div className="space-y-2">
          <div className="h-3 w-full bg-zinc-800 rounded" />
          <div className="h-3 w-4/5 bg-zinc-800 rounded" />
        </div>
        <div className="aspect-video w-full bg-zinc-800 rounded-lg" />
      </div>
    </Skeleton>
  );
}
