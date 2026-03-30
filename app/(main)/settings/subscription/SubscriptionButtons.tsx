"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function SubscribeButton({ tier }: { tier: "monthly" | "annual" }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleClick() {
    setLoading(true);
    try {
      const res = await fetch("/api/subscriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier }),
      });
      const data = await res.json();
      if (data.url) {
        router.push(data.url);
      }
    } finally {
      setLoading(false);
    }
  }

  const label = tier === "monthly" ? "Subscribe Monthly ($30/mo)" : "Subscribe Annually ($200/yr)";

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
    >
      {loading ? "Redirecting..." : label}
    </button>
  );
}

export function CancelSubscriptionButton() {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const router = useRouter();

  async function handleClick() {
    if (!confirm("Cancel your subscription? It will remain active until the end of the billing period.")) return;
    setLoading(true);
    try {
      const res = await fetch("/api/subscriptions/cancel", { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        alert(data.error ?? "Failed to cancel subscription");
        return;
      }
      setDone(true);
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  if (done) return <p className="text-sm text-gray-600">Cancellation scheduled. Active until end of period.</p>;

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="rounded-lg border border-red-300 px-5 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
    >
      {loading ? "Cancelling..." : "Cancel subscription"}
    </button>
  );
}
