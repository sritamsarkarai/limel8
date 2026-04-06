"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  listingId: string;
  initialTitle: string;
  initialDescription: string;
  initialPrice: string;
  initialLocation: string;
  initialStockQuantity?: number;
  listingType: string;
  listingStatus: string;
};

export function ListingOwnerActions({
  listingId,
  initialTitle,
  initialDescription,
  initialPrice,
  initialLocation,
  initialStockQuantity,
  listingType,
  listingStatus,
}: Props) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [location, setLocation] = useState(initialLocation);
  const [stockQuantity, setStockQuantity] = useState(String(initialStockQuantity ?? ""));

  const canEditPrice = listingStatus === "draft";

  async function handleSave() {
    setSaving(true);
    setError(null);
    const body: Record<string, unknown> = { title, description, location };
    if (listingType === "physical" && stockQuantity) {
      body.stockQuantity = parseInt(stockQuantity, 10);
    }
    const res = await fetch(`/api/listings/${listingId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setSaving(false);
    if (res.ok) {
      setEditing(false);
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.error ?? "Failed to save");
    }
  }

  async function handleDelete() {
    if (!confirm("Delete this listing? This cannot be undone.")) return;
    setDeleting(true);
    await fetch(`/api/listings/${listingId}`, { method: "DELETE" });
    router.push("/listings");
  }

  if (editing) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/80 backdrop-blur-sm px-4">
        <div className="w-full max-w-lg rounded-2xl border border-cyan-500/[0.27] bg-zinc-900 p-6 shadow-[0_0_0_1px_rgba(34,211,238,0.13),0_0_40px_rgba(34,211,238,0.13)] space-y-4">
          <h2 className="text-lg font-bold text-white" style={{ fontFamily: "var(--font-heading)" }}>Edit Listing</h2>

          {error && (
            <div className="rounded-lg bg-red-950 border border-red-800 p-3 text-sm text-red-400">{error}</div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-400">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500/50"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-400">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500/50 resize-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-400">Location</label>
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. New York, NY"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500/50"
            />
          </div>

          {listingType === "physical" && (
            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-400">Stock Quantity</label>
              <input
                type="number"
                min="0"
                value={stockQuantity}
                onChange={(e) => setStockQuantity(e.target.value)}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500/50"
              />
            </div>
          )}

          {!canEditPrice && (
            <p className="text-xs text-zinc-500">Price cannot be changed after publishing.</p>
          )}

          <div className="flex gap-2 pt-1">
            <button
              onClick={handleSave}
              disabled={saving || !title.trim()}
              className="flex-1 rounded-lg bg-gradient-to-r from-cyan-500 to-violet-500 py-2 text-sm font-bold text-zinc-950 disabled:opacity-50 transition-opacity hover:opacity-90"
            >
              {saving ? "Saving…" : "Save Changes"}
            </button>
            <button
              onClick={() => { setEditing(false); setError(null); }}
              className="px-4 rounded-lg border border-zinc-700 text-sm text-zinc-400 hover:text-white hover:border-zinc-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => setEditing(true)}
        className="text-sm text-zinc-400 hover:text-cyan-400 border border-zinc-700 hover:border-cyan-500/40 px-3 py-1.5 rounded-lg transition-colors"
      >
        Edit
      </button>
      <button
        onClick={handleDelete}
        disabled={deleting}
        className="text-sm text-zinc-400 hover:text-red-400 border border-zinc-700 hover:border-red-500/40 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
      >
        {deleting ? "Deleting…" : "Delete"}
      </button>
    </div>
  );
}
