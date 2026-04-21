"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

function ResetPasswordForm() {
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get("token");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  if (!token) {
    return (
      <>
        <div className="mb-5 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 border border-red-500/25">
            <svg className="h-7 w-7 text-red-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
            </svg>
          </div>
        </div>
        <h1 className="mb-2 text-2xl font-bold text-white text-center" style={{ fontFamily: "var(--font-heading)" }}>
          Invalid link
        </h1>
        <p className="mb-6 text-sm text-zinc-400 text-center">This reset link is missing a token. Please request a new one.</p>
        <div className="text-center">
          <a href="/forgot-password" className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-400 to-violet-400 px-6 py-2.5 text-sm font-bold text-zinc-950 cursor-pointer shadow-[0_0_20px_rgba(34,211,238,0.2)] hover:shadow-[0_0_28px_rgba(34,211,238,0.35)] transition-shadow duration-200">
            Request new link
          </a>
        </div>
      </>
    );
  }

  if (done) {
    return (
      <>
        <style>{`
          @keyframes scaleIn { from { opacity:0; transform:scale(0.6); } to { opacity:1; transform:scale(1); } }
          @keyframes fadeUp  { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
          @keyframes checkDraw { from { stroke-dashoffset:40; } to { stroke-dashoffset:0; } }
        `}</style>
        <div className="mb-5 flex justify-center" style={{ animation: "scaleIn 500ms cubic-bezier(0.16,1,0.3,1) 50ms both" }}>
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/25">
            <svg className="h-7 w-7 text-emerald-400" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeDasharray="40" d="M4.5 12.75l6 6 9-13.5"
                style={{ animation: "checkDraw 500ms ease 550ms both" }} />
            </svg>
          </div>
        </div>
        <div className="text-center" style={{ animation: "fadeUp 400ms cubic-bezier(0.16,1,0.3,1) 200ms both" }}>
          <h1 className="mb-2 text-2xl font-bold text-white" style={{ fontFamily: "var(--font-heading)" }}>
            Password updated!
          </h1>
          <p className="mb-6 text-sm text-zinc-400">Your password has been reset. You can now sign in.</p>
          <a
            href="/login"
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-400 to-violet-400 px-6 py-2.5 text-sm font-bold text-zinc-950 cursor-pointer shadow-[0_0_20px_rgba(34,211,238,0.2)] hover:shadow-[0_0_28px_rgba(34,211,238,0.35)] transition-shadow duration-200"
          >
            Sign in
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </a>
        </div>
      </>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong");
      } else {
        setDone(true);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
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
          Reset password
        </h1>
        <p className="text-sm text-zinc-400">Choose a new password for your account.</p>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-950 border border-red-800 p-3 text-sm text-red-400" style={{ animation: "fadeUp 250ms ease both" }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" style={{ animation: "fadeUp 400ms cubic-bezier(0.16,1,0.3,1) 310ms both" }}>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-zinc-300 mb-1">
            New password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              required
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 8 characters"
              className="block w-full rounded-lg border border-cyan-500/[0.27] bg-zinc-800 px-3 py-2.5 pr-10 text-sm text-white placeholder:text-zinc-600 focus:border-cyan-500/[0.4] focus:outline-none shadow-[0_0_0_1px_rgba(34,211,238,0.13),0_0_12px_rgba(34,211,238,0.08)] focus:shadow-[0_0_0_1px_rgba(34,211,238,0.27),0_0_20px_rgba(34,211,238,0.16)] transition-shadow duration-150"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                </svg>
              ) : (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
              )}
            </button>
          </div>
        </div>
        <div>
          <label htmlFor="confirm" className="block text-sm font-medium text-zinc-300 mb-1">
            Confirm new password
          </label>
          <div className="relative">
            <input
              id="confirm"
              type={showConfirm ? "text" : "password"}
              required
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Repeat your password"
              className="block w-full rounded-lg border border-cyan-500/[0.27] bg-zinc-800 px-3 py-2.5 pr-10 text-sm text-white placeholder:text-zinc-600 focus:border-cyan-500/[0.4] focus:outline-none shadow-[0_0_0_1px_rgba(34,211,238,0.13),0_0_12px_rgba(34,211,238,0.08)] focus:shadow-[0_0_0_1px_rgba(34,211,238,0.27),0_0_20px_rgba(34,211,238,0.16)] transition-shadow duration-150"
            />
            <button
              type="button"
              onClick={() => setShowConfirm((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
              aria-label={showConfirm ? "Hide password" : "Show password"}
            >
              {showConfirm ? (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                </svg>
              ) : (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
              )}
            </button>
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-gradient-to-r from-cyan-400 to-violet-400 px-4 py-2.5 text-sm font-bold text-zinc-950 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-[0_0_20px_rgba(34,211,238,0.2),0_4px_12px_rgba(34,211,238,0.13)] hover:shadow-[0_0_28px_rgba(34,211,238,0.35)] transition-shadow duration-200"
        >
          {loading ? "Updating…" : "Reset password"}
        </button>
      </form>

      <p className="mt-5 text-center text-xs text-zinc-600" style={{ animation: "fadeUp 400ms cubic-bezier(0.16,1,0.3,1) 420ms both" }}>
        <a href="/login" className="text-zinc-500 hover:text-zinc-300 transition-colors duration-150 cursor-pointer">
          Back to sign in
        </a>
      </p>
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4">
      <style>{`
        @keyframes bloomIn { from { opacity:0; transform:scale(0.8); } to { opacity:1; transform:scale(1); } }
        @keyframes fadeUp  { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
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
        <Suspense>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
