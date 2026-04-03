"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type BookingRequestFormProps = {
  serviceId: string;
  serviceName: string;
  servicePrice: string | null;
  orgSlug: string;
};

export function BookingRequestForm({ serviceId, serviceName, servicePrice, orgSlug }: BookingRequestFormProps) {
  const router = useRouter();
  const [requestedDate, setRequestedDate] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ serviceId, requestedDate: requestedDate.trim(), message: message.trim() || null }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Failed"); return; }
      setSuccess(true);
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  const inputClass = "mt-1 block w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/20";

  if (success) {
    return (
      <div className="rounded-xl border border-cyan-500/[0.27] bg-zinc-900 p-6 text-center space-y-2">
        <p className="text-white font-semibold">Booking request sent!</p>
        <p className="text-sm text-zinc-400">The organization will confirm or decline your request. You&apos;ll receive a message when they respond.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-cyan-500/[0.27] bg-zinc-900 p-6 shadow-[0_0_0_1px_rgba(34,211,238,0.13),0_0_20px_rgba(34,211,238,0.13),0_0_40px_rgba(34,211,238,0.05)]">
      <div>
        <p className="text-sm font-medium text-zinc-300">Service</p>
        <p className="text-white font-semibold">{serviceName}</p>
        {servicePrice && <p className="text-cyan-400 text-sm font-bold">${servicePrice}</p>}
        {!servicePrice && <p className="text-green-400 text-sm font-bold">Free</p>}
      </div>
      {error && <div className="rounded-lg bg-red-950 border border-red-800 p-3 text-sm text-red-400">{error}</div>}
      <div>
        <label className="block text-sm font-medium text-zinc-300">Preferred Date / Time <span className="text-red-400">*</span></label>
        <input
          required
          value={requestedDate}
          onChange={(e) => setRequestedDate(e.target.value)}
          className={inputClass}
          placeholder="e.g. Monday 14 April, 2pm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-zinc-300">Message (optional)</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={3}
          className={inputClass + " resize-none"}
          placeholder="Any details the organization should know..."
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-gradient-to-r from-cyan-400 to-violet-400 px-4 py-2 text-sm font-bold text-zinc-950 disabled:opacity-50 cursor-pointer transition-opacity"
      >
        {loading ? "Sending…" : "Send Booking Request"}
      </button>
    </form>
  );
}
