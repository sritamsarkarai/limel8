"use client";

import { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sent" | "error">("idle");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
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
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes bloomIn {
          from { opacity: 0; transform: scale(0.8); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.6); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>

      <div
        className="pointer-events-none fixed inset-0"
        style={{
          background: "radial-gradient(ellipse at 50% 30%, rgba(34,211,238,0.07) 0%, transparent 60%)",
          animation: "bloomIn 900ms cubic-bezier(0.16,1,0.3,1) both",
        }}
      />

      <div
        className="relative w-full max-w-md rounded-2xl bg-zinc-900 border border-cyan-500/[0.27] p-8 shadow-[0_0_0_1px_rgba(34,211,238,0.13),0_0_20px_rgba(34,211,238,0.13),0_0_40px_rgba(34,211,238,0.05)]"
        style={{ animation: "fadeUp 500ms cubic-bezier(0.16,1,0.3,1) 100ms both" }}
      >
        {status === "sent" ? (
          <div className="text-center">
            <div className="mb-5 flex justify-center" style={{ animation: "scaleIn 500ms cubic-bezier(0.16,1,0.3,1) 50ms both" }}>
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-cyan-500/10 border border-cyan-500/20">
                <svg className="h-7 w-7 text-cyan-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                </svg>
              </div>
            </div>
            <div style={{ animation: "fadeUp 400ms cubic-bezier(0.16,1,0.3,1) 200ms both" }}>
              <h1 className="mb-2 text-2xl font-bold text-white" style={{ fontFamily: "var(--font-heading)" }}>
                Check your email
              </h1>
              <p className="text-sm text-zinc-400 leading-relaxed">
                If that address has an account, a reset link is on its way. The link expires in{" "}
                <span className="text-zinc-300 font-medium">1 hour</span>.
              </p>
            </div>
            <div className="mt-6 border-t border-zinc-800 pt-5" style={{ animation: "fadeUp 400ms cubic-bezier(0.16,1,0.3,1) 320ms both" }}>
              <a href="/login" className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors duration-150 cursor-pointer">
                Back to sign in
              </a>
            </div>
          </div>
        ) : (
          <>
            {/* Icon */}
            <div className="mb-5 flex justify-center" style={{ animation: "fadeUp 400ms cubic-bezier(0.16,1,0.3,1) 150ms both" }}>
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-cyan-500/10 border border-cyan-500/20">
                <svg className="h-7 w-7 text-cyan-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                </svg>
              </div>
            </div>

            {/* Heading */}
            <div className="mb-6 text-center" style={{ animation: "fadeUp 400ms cubic-bezier(0.16,1,0.3,1) 230ms both" }}>
              <h1 className="mb-1 text-2xl font-bold text-white" style={{ fontFamily: "var(--font-heading)" }}>
                Forgot password?
              </h1>
              <p className="text-sm text-zinc-400">
                Enter your email and we&apos;ll send you a reset link.
              </p>
            </div>

            {status === "error" && (
              <div className="mb-4 rounded-lg bg-red-950 border border-red-800 p-3 text-sm text-red-400" style={{ animation: "fadeUp 250ms ease both" }}>
                Something went wrong. Please try again.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4" style={{ animation: "fadeUp 400ms cubic-bezier(0.16,1,0.3,1) 310ms both" }}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-zinc-300 mb-1">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="block w-full rounded-lg border border-cyan-500/[0.27] bg-zinc-800 px-3 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:border-cyan-500/[0.4] focus:outline-none shadow-[0_0_0_1px_rgba(34,211,238,0.13),0_0_12px_rgba(34,211,238,0.08)] focus:shadow-[0_0_0_1px_rgba(34,211,238,0.27),0_0_20px_rgba(34,211,238,0.16)] transition-shadow duration-150"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-gradient-to-r from-cyan-400 to-violet-400 px-4 py-2.5 text-sm font-bold text-zinc-950 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-[0_0_20px_rgba(34,211,238,0.2),0_4px_12px_rgba(34,211,238,0.13)] hover:shadow-[0_0_28px_rgba(34,211,238,0.35)] transition-shadow duration-200"
              >
                {loading ? "Sending…" : "Send reset link"}
              </button>
            </form>

            <p
              className="mt-5 text-center text-xs text-zinc-600"
              style={{ animation: "fadeUp 400ms cubic-bezier(0.16,1,0.3,1) 420ms both" }}
            >
              <a href="/login" className="text-zinc-500 hover:text-zinc-300 transition-colors duration-150 cursor-pointer">
                Back to sign in
              </a>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
