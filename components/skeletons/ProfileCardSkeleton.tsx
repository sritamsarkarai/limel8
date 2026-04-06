"use client";

import { Skeleton } from "boneyard-js/react";

export function ProfileCardSkeleton({ loading }: { loading: boolean }) {
  return (
    <Skeleton name="profile-card" loading={loading} color="#27272a" animate>
      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
        <div className="flex items-start gap-4">
          <div className="h-14 w-14 rounded-full bg-zinc-800 flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-32 bg-zinc-800 rounded" />
            <div className="h-2 w-24 bg-zinc-800 rounded" />
            <div className="h-2 w-20 bg-zinc-800 rounded" />
            <div className="h-5 w-20 bg-zinc-800 rounded-full mt-1" />
          </div>
        </div>
      </div>
    </Skeleton>
  );
}
