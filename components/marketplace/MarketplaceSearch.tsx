"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function MarketplaceSearch({
  defaultQ,
  defaultLocation,
}: {
  defaultQ: string;
  defaultLocation: string;
}) {
  const router = useRouter();
  const [q, setQ] = useState(defaultQ);
  const [location, setLocation] = useState(defaultLocation);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    if (location.trim()) params.set("location", location.trim());
    router.push(`/marketplace${params.toString() ? `?${params}` : ""}`);
  }

  function handleClear() {
    setQ("");
    setLocation("");
    router.push("/marketplace");
  }

  const hasFilters = defaultQ || defaultLocation;

  return (
    <form onSubmit={handleSearch} className="mb-6 flex flex-col sm:flex-row gap-2">
      <input
        type="text"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search listings…"
        className="flex-1 rounded-lg border border-cyan-500/[0.27] bg-zinc-800 px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-cyan-500/[0.4] shadow-[0_0_0_1px_rgba(34,211,238,0.13)] focus:shadow-[0_0_0_1px_rgba(34,211,238,0.27)]"
      />
      <div className="relative">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
        </svg>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Location…"
          className="w-full sm:w-44 rounded-lg border border-cyan-500/[0.27] bg-zinc-800 pl-9 pr-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-cyan-500/[0.4] shadow-[0_0_0_1px_rgba(34,211,238,0.13)] focus:shadow-[0_0_0_1px_rgba(34,211,238,0.27)]"
        />
      </div>
      <button
        type="submit"
        className="rounded-lg bg-gradient-to-r from-cyan-500 to-violet-500 px-4 py-2 text-sm font-bold text-zinc-950 shadow-[0_0_12px_rgba(34,211,238,0.25)] hover:opacity-90 transition-opacity"
      >
        Search
      </button>
      {hasFilters && (
        <button
          type="button"
          onClick={handleClear}
          className="rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-400 hover:text-white hover:border-zinc-600 transition-colors"
        >
          Clear
        </button>
      )}
    </form>
  );
}
