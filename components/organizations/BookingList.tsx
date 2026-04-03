"use client";

import { useState } from "react";

type Booking = {
  id: string;
  requestedDate: string;
  message?: string | null;
  status: string;
  createdAt: string;
  service: { id: string; name: string; price: string | null };
  customer: { id: string; name: string; avatarUrl?: string | null };
};

export function BookingList({ bookings, orgId }: { bookings: Booking[]; orgId: string }) {
  const [list, setList] = useState(bookings);
  const [loading, setLoading] = useState<string | null>(null);

  async function updateStatus(bookingId: string, status: "confirmed" | "declined") {
    setLoading(bookingId);
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setList((prev) => prev.map((b) => b.id === bookingId ? { ...b, status } : b));
      }
    } finally {
      setLoading(null);
    }
  }

  async function initiateCheckout(bookingId: string) {
    setLoading(bookingId);
    try {
      const res = await fetch(`/api/bookings/${bookingId}/checkout`, { method: "POST" });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } finally {
      setLoading(null);
    }
  }

  const STATUS_COLORS: Record<string, string> = {
    pending: "text-yellow-400 bg-yellow-950 border-yellow-800",
    confirmed: "text-green-400 bg-green-950 border-green-800",
    declined: "text-red-400 bg-red-950 border-red-800",
    cancelled: "text-zinc-400 bg-zinc-800 border-zinc-700",
  };

  if (!list.length) return <p className="text-sm text-zinc-500">No bookings yet.</p>;

  return (
    <div className="space-y-3">
      {list.map((booking) => (
        <div key={booking.id} className="rounded-xl border border-cyan-500/[0.27] bg-zinc-900 p-4 shadow-[0_0_0_1px_rgba(34,211,238,0.13),0_0_12px_rgba(34,211,238,0.06)]">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              {booking.customer.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={booking.customer.avatarUrl} alt={booking.customer.name} className="w-8 h-8 rounded-full object-cover border border-zinc-700" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-cyan-950 flex items-center justify-center text-xs font-bold text-cyan-400">
                  {booking.customer.name[0].toUpperCase()}
                </div>
              )}
              <div>
                <p className="text-sm font-semibold text-white">{booking.customer.name}</p>
                <p className="text-xs text-zinc-500">{booking.service.name}{booking.service.price ? ` — $${booking.service.price}` : " — Free"}</p>
              </div>
            </div>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${STATUS_COLORS[booking.status] ?? ""}`}>
              {booking.status}
            </span>
          </div>
          <p className="mt-2 text-xs text-zinc-400">Requested: {booking.requestedDate}</p>
          {booking.message && <p className="mt-1 text-xs text-zinc-500 italic">&quot;{booking.message}&quot;</p>}
          {booking.status === "pending" && (
            <div className="mt-3 flex gap-2">
              {booking.service.price ? (
                <button
                  onClick={() => initiateCheckout(booking.id)}
                  disabled={loading === booking.id}
                  className="rounded-lg bg-gradient-to-r from-cyan-400 to-violet-400 px-3 py-1.5 text-xs font-bold text-zinc-950 disabled:opacity-50 cursor-pointer"
                >
                  {loading === booking.id ? "…" : "Confirm & Request Payment"}
                </button>
              ) : (
                <button
                  onClick={() => updateStatus(booking.id, "confirmed")}
                  disabled={loading === booking.id}
                  className="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-bold text-white disabled:opacity-50 cursor-pointer hover:bg-green-500 transition-colors"
                >
                  {loading === booking.id ? "…" : "Confirm"}
                </button>
              )}
              <button
                onClick={() => updateStatus(booking.id, "declined")}
                disabled={loading === booking.id}
                className="rounded-lg border border-zinc-700 px-3 py-1.5 text-xs font-medium text-zinc-400 hover:text-white hover:border-zinc-500 disabled:opacity-50 cursor-pointer transition-colors"
              >
                Decline
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
