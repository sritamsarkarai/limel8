"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function ConnectStripeButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleConnect() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/connect/onboard", { method: "POST" });
      const data = await res.json();
      if (!res.ok || !data.url) {
        setError(data.error ?? "Failed to start onboarding. Please try again.");
        return;
      }
      router.push(data.url);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={handleConnect}
        disabled={loading}
        className="bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white font-semibold px-6 py-3 rounded-lg"
      >
        {loading ? "Connecting..." : "Connect Stripe to publish"}
      </button>
      {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
    </>
  );
}
