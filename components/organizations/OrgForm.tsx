"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const CATEGORIES = [
  { value: "studio", label: "Studio" },
  { value: "dance_school", label: "Dance School" },
  { value: "vocal_school", label: "Vocal School" },
  { value: "music_school", label: "Music School" },
  { value: "photography_studio", label: "Photography Studio" },
  { value: "recording_studio", label: "Recording Studio" },
  { value: "rehearsal_space", label: "Rehearsal Space" },
  { value: "event_venue", label: "Event Venue" },
  { value: "other", label: "Other" },
];

type OrgFormProps = {
  mode: "create";
} | {
  mode: "edit";
  orgId: string;
  initial: { name: string; category: string; description?: string | null };
};

export function OrgForm(props: OrgFormProps) {
  const router = useRouter();
  const initial = props.mode === "edit" ? props.initial : null;
  const [name, setName] = useState(initial?.name ?? "");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState(initial?.category ?? "studio");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function autoSlug(value: string) {
    return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (props.mode === "create") {
        const res = await fetch("/api/organizations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: name.trim(), slug: slug.trim(), category, description: description.trim() || null }),
        });
        const data = await res.json();
        if (!res.ok) { setError(data.error ?? "Failed"); return; }
        router.push(`/orgs/${data.id}`);
        router.refresh();
      } else {
        const res = await fetch(`/api/organizations/${props.orgId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: name.trim(), category, description: description.trim() || null }),
        });
        const data = await res.json();
        if (!res.ok) { setError(data.error ?? "Failed"); return; }
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  }

  const inputClass = "mt-1 block w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/20";
  const labelClass = "block text-sm font-medium text-zinc-300";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="rounded-lg bg-red-950 border border-red-800 p-3 text-sm text-red-400">{error}</div>}
      <div>
        <label className={labelClass}>Organization Name <span className="text-red-400">*</span></label>
        <input
          required
          value={name}
          onChange={(e) => { setName(e.target.value); if (props.mode === "create") setSlug(autoSlug(e.target.value)); }}
          className={inputClass}
          placeholder="My Dance Studio"
        />
      </div>
      {props.mode === "create" && (
        <div>
          <label className={labelClass}>URL Slug <span className="text-red-400">*</span></label>
          <input
            required
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className={inputClass}
            placeholder="my-dance-studio"
            pattern="[a-z0-9-]+"
            title="Lowercase letters, numbers, and hyphens only"
          />
          <p className="mt-1 text-xs text-zinc-500">Your page will be at /org/{slug || "your-slug"}</p>
        </div>
      )}
      <div>
        <label className={labelClass}>Category <span className="text-red-400">*</span></label>
        <select value={category} onChange={(e) => setCategory(e.target.value)} className={inputClass + " cursor-pointer"}>
          {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
        </select>
      </div>
      <div>
        <label className={labelClass}>Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className={inputClass + " resize-none"}
          placeholder="Tell people about your organization..."
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-gradient-to-r from-cyan-400 to-violet-400 px-4 py-2 text-sm font-bold text-zinc-950 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity cursor-pointer"
      >
        {loading ? "Saving…" : props.mode === "create" ? "Create Organization" : "Save Changes"}
      </button>
    </form>
  );
}
