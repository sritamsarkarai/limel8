"use client";

import { Skeleton } from "boneyard-js/react";

export function OrgCardSkeleton({ loading }: { loading: boolean }) {
  return (
    <Skeleton name="org-card" loading={loading} color="#27272a" animate>
      <div className="flex items-start gap-3 rounded-xl border border-zinc-800 bg-zinc-900 p-4">
        <div className="w-12 h-12 rounded-xl bg-zinc-800 shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-3 w-36 bg-zinc-800 rounded" />
          <div className="h-2 w-24 bg-zinc-800 rounded" />
          <div className="h-2 w-48 bg-zinc-800 rounded" />
          <div className="h-2 w-16 bg-zinc-800 rounded" />
        </div>
      </div>
    </Skeleton>
  );
}
