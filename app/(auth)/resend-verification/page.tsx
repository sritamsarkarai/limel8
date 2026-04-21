"use client";

import { useState } from "react";

export default function ResendVerificationPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sent" | "error">("idle");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setStatus(res.ok ? "sent" : "error");
    } catch {
      setStatus("error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4">
      <div className="w-full max-w-md rounded-2xl bg-zinc-900 border border-cyan-500/[0.27] p-8 shadow-[0_0_0_1px_rgba(34,211,238,0.13),0_0_20px_rgba(34,211,238,0.13),0_0_40px_rgba(34,211,238,0.05)]">
        <h1 className="mb-2 text-xl font-bold text-white" style={{ fontFamily: "var(--font-heading)" }}>
          Resend verification email
        </h1>

        {status === "sent" ? (
          <p className="text-sm text-zinc-400">
            If that email is registered and unverified, we've sent a new verification link. Check your inbox.
          </p>
        ) : (
          <>
            <p className="mb-6 text-sm text-zinc-400">
              Enter your email address and we'll send you a new verification link.
            </p>
            {status === "error" && (
              <div className="mb-4 rounded-lg bg-red-950 border border-red-800 p-3 text-sm text-red-400">
                Something went wrong. Please try again.
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-zinc-300">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-cyan-500/[0.27] bg-zinc-800 px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:border-cyan-500/[0.4] focus:outline-none"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-gradient-to-r from-cyan-400 to-violet-400 px-4 py-2 text-sm font-bold text-zinc-950 disabled:opacity-50 cursor-pointer"
              >
                {loading ? "Sending…" : "Send verification email"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
