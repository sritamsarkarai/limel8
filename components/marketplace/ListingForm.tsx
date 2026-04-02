"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function ListingForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [type, setType] = useState<"digital" | "physical">("digital");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const form = e.currentTarget;
    const data = new FormData(form);

    const body: Record<string, unknown> = {
      title: data.get("title") as string,
      description: data.get("description") as string,
      price: parseFloat(data.get("price") as string),
      type: data.get("type") as string,
    };

    if (type === "physical") {
      const stockQuantity = data.get("stockQuantity");
      if (stockQuantity) {
        body.stockQuantity = parseInt(stockQuantity as string, 10);
      }
    }

    try {
      const res = await fetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const json = await res.json();
        setError(json.error ?? "Failed to create listing");
        return;
      }

      router.refresh();
      router.push("/marketplace");
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-cyan-500/[0.27] bg-zinc-900 p-6 shadow-[0_0_0_1px_rgba(34,211,238,0.13),0_0_20px_rgba(34,211,238,0.13),0_0_40px_rgba(34,211,238,0.05)]">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-lg bg-red-950 border border-red-800 p-3 text-sm text-red-400">{error}</div>
        )}

        <div>
          <label htmlFor="title" className="block text-sm font-medium text-zinc-300">
            Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            className="mt-1 block w-full rounded-lg border border-cyan-500/[0.27] bg-zinc-800 px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:border-cyan-500/[0.4] focus:outline-none shadow-[0_0_0_1px_rgba(34,211,238,0.13),0_0_12px_rgba(34,211,238,0.08)] focus:shadow-[0_0_0_1px_rgba(34,211,238,0.27),0_0_20px_rgba(34,211,238,0.16)]"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-zinc-300">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            required
            rows={4}
            className="mt-1 block w-full rounded-lg border border-cyan-500/[0.27] bg-zinc-800 px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:border-cyan-500/[0.4] focus:outline-none shadow-[0_0_0_1px_rgba(34,211,238,0.13),0_0_12px_rgba(34,211,238,0.08)] focus:shadow-[0_0_0_1px_rgba(34,211,238,0.27),0_0_20px_rgba(34,211,238,0.16)]"
          />
        </div>

        <div>
          <label htmlFor="price" className="block text-sm font-medium text-zinc-300">
            Price (USD)
          </label>
          <input
            id="price"
            name="price"
            type="number"
            min="0"
            step="0.01"
            required
            className="mt-1 block w-full rounded-lg border border-cyan-500/[0.27] bg-zinc-800 px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:border-cyan-500/[0.4] focus:outline-none shadow-[0_0_0_1px_rgba(34,211,238,0.13),0_0_12px_rgba(34,211,238,0.08)] focus:shadow-[0_0_0_1px_rgba(34,211,238,0.27),0_0_20px_rgba(34,211,238,0.16)]"
          />
        </div>

        <div>
          <label htmlFor="type" className="block text-sm font-medium text-zinc-300">
            Type
          </label>
          <select
            id="type"
            name="type"
            value={type}
            onChange={(e) => setType(e.target.value as "digital" | "physical")}
            className={`mt-1 block w-full rounded-lg border bg-zinc-800 px-3 py-2 text-sm text-white focus:outline-none cursor-pointer transition-all ${
              type === "digital"
                ? "border-cyan-500/[0.4] shadow-[0_0_0_1px_rgba(34,211,238,0.27),0_0_12px_rgba(34,211,238,0.13)]"
                : "border-violet-400/[0.4] shadow-[0_0_0_1px_rgba(167,139,250,0.27),0_0_12px_rgba(167,139,250,0.13)]"
            }`}
          >
            <option value="digital">Digital</option>
            <option value="physical">Physical</option>
          </select>
        </div>

        {type === "physical" && (
          <div>
            <label htmlFor="stockQuantity" className="block text-sm font-medium text-zinc-300">
              Stock Quantity
            </label>
            <input
              id="stockQuantity"
              name="stockQuantity"
              type="number"
              min="0"
              className="mt-1 block w-full rounded-lg border border-violet-400/[0.27] bg-zinc-800 px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:border-violet-400/[0.4] focus:outline-none shadow-[0_0_0_1px_rgba(167,139,250,0.13),0_0_12px_rgba(167,139,250,0.08)] focus:shadow-[0_0_0_1px_rgba(167,139,250,0.27),0_0_20px_rgba(167,139,250,0.16)]"
            />
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-gradient-to-r from-cyan-400 to-violet-400 px-4 py-2 text-sm font-bold text-zinc-950 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity cursor-pointer shadow-[0_0_20px_rgba(34,211,238,0.2),0_4px_12px_rgba(34,211,238,0.13)]"
        >
          {loading ? "Creating..." : "Create Listing"}
        </button>
      </form>
    </div>
  );
}
