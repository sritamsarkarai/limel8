"use client";

import { Skeleton } from "boneyard-js/react";

export function ConversationItemSkeleton({ loading }: { loading: boolean }) {
  return (
    <Skeleton name="conversation-item" loading={loading} color="#27272a" animate>
      <div className="flex items-center gap-3 px-4 py-3 border-b border-zinc-800">
        <div className="w-10 h-10 rounded-full bg-zinc-800 shrink-0" />
        <div className="flex-1 space-y-1.5">
          <div className="h-3 w-28 bg-zinc-800 rounded" />
          <div className="h-2 w-48 bg-zinc-800 rounded" />
        </div>
        <div className="h-2 w-10 bg-zinc-800 rounded shrink-0" />
      </div>
    </Skeleton>
  );
}
