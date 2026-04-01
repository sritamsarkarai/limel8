"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function BuyButton({ listingId }: { listingId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleBuy() {
    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listingId }),
      });
      const data = await res.json();
      if (data.url) {
        router.push(data.url);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleBuy}
      disabled={loading}
      className="bg-cyan-500 hover:bg-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed text-zinc-950 font-bold px-6 py-3 rounded-xl transition-colors duration-200 cursor-pointer"
    >
      {loading ? "Redirecting..." : "Buy Now"}
    </button>
  );
}
