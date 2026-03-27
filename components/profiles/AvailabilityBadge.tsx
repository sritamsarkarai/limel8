const LABELS: Record<string, string> = {
  available_for_hire: "Available for Hire",
  open_to_collab: "Open to Collab",
  open_to_join: "Open to Join",
  not_available: "Not Available",
};

const COLORS: Record<string, string> = {
  available_for_hire: "bg-green-100 text-green-800",
  open_to_collab: "bg-blue-100 text-blue-800",
  open_to_join: "bg-purple-100 text-purple-800",
  not_available: "bg-gray-100 text-gray-500",
};

export function AvailabilityBadge({ status }: { status: string }) {
  const label = LABELS[status] ?? status;
  const colorClass = COLORS[status] ?? "bg-gray-100 text-gray-500";
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>
      {label}
    </span>
  );
}
