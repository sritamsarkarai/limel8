const LABELS: Record<string, string> = {
  available_for_hire: "Available for Hire",
  open_to_collab: "Open to Collab",
  open_to_join: "Open to Join",
  not_available: "Not Available",
};

const COLORS: Record<string, string> = {
  available_for_hire: "bg-cyan-950 text-cyan-400 border border-cyan-500/40 shadow-[0_0_6px_rgba(34,211,238,0.2)]",
  open_to_collab:     "bg-cyan-950 text-cyan-400 border border-cyan-500/40 shadow-[0_0_6px_rgba(34,211,238,0.2)]",
  open_to_join:       "bg-violet-950/60 text-violet-400 border border-violet-400/40 shadow-[0_0_6px_rgba(167,139,250,0.2)]",
  not_available:      "bg-zinc-800 text-zinc-500 border border-zinc-700",
};

export function AvailabilityBadge({ status }: { status: string }) {
  const label = LABELS[status] ?? status;
  const colorClass = COLORS[status] ?? "bg-zinc-800 text-zinc-500 border border-zinc-700";
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${colorClass}`}>
      {label}
    </span>
  );
}
