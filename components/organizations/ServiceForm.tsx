"use client";

import { useState } from "react";

type ServiceFormProps = {
  orgId: string;
  onCreated: (service: { id: string; name: string; price: string | null; duration: string | null }) => void;
};

export function ServiceForm({ orgId, onCreated }: ServiceFormProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/organizations/${orgId}/services`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim() || null,
          price: price ? parseFloat(price) : null,
          duration: duration.trim() || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Failed"); return; }
      onCreated(data);
      setName(""); setDescription(""); setPrice(""); setDuration("");
    } finally {
      setLoading(false);
    }
  }

  const inputClass = "mt-1 block w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/20";
  const labelClass = "block text-sm font-medium text-zinc-300";

  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded-xl border border-cyan-500/[0.27] bg-zinc-900 p-4 shadow-[0_0_0_1px_rgba(34,211,238,0.13),0_0_12px_rgba(34,211,238,0.06)]">
      <h3 className="text-sm font-semibold text-white">Add Service</h3>
      {error && <div className="rounded-lg bg-red-950 border border-red-800 p-3 text-sm text-red-400">{error}</div>}
      <div>
        <label className={labelClass}>Service Name <span className="text-red-400">*</span></label>
        <input required value={name} onChange={(e) => setName(e.target.value)} className={inputClass} placeholder="1hr Studio Session" />
      </div>
      <div>
        <label className={labelClass}>Description</label>
        <input value={description} onChange={(e) => setDescription(e.target.value)} className={inputClass} placeholder="What&apos;s included?" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>Price (USD)</label>
          <input type="number" min="0" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} className={inputClass} placeholder="Leave empty for free" />
        </div>
        <div>
          <label className={labelClass}>Duration</label>
          <input value={duration} onChange={(e) => setDuration(e.target.value)} className={inputClass} placeholder="e.g. 1 hour" />
        </div>
      </div>
      <button type="submit" disabled={loading} className="rounded-lg bg-cyan-500 px-4 py-2 text-sm font-bold text-zinc-950 disabled:opacity-50 cursor-pointer hover:bg-cyan-400 transition-colors">
        {loading ? "Adding…" : "Add Service"}
      </button>
    </form>
  );
}
