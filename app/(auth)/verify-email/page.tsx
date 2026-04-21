"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function VerifyEmailContent() {
  const params = useSearchParams();
  const success = params.get("success");
  const error = params.get("error");

  const messages: Record<string, string> = {
    missing: "The verification link is incomplete.",
    invalid: "This verification link is invalid or has already been used.",
    expired: "This verification link has expired. Please request a new one.",
  };

  if (success) {
    return (
      <>
        <style>{`
          @keyframes scaleIn {
            from { opacity: 0; transform: scale(0.6); }
            to   { opacity: 1; transform: scale(1); }
          }
          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(10px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          @keyframes checkDraw {
            from { stroke-dashoffset: 40; }
            to   { stroke-dashoffset: 0; }
          }
        `}</style>

        {/* Success icon */}
        <div className="mb-5 flex justify-center" style={{ animation: "scaleIn 500ms cubic-bezier(0.16,1,0.3,1) 150ms both" }}>
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/25">
            <svg className="h-7 w-7 text-emerald-400" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" aria-hidden="true">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="40"
                d="M4.5 12.75l6 6 9-13.5"
                style={{ animation: "checkDraw 500ms ease 600ms both" }}
              />
            </svg>
          </div>
        </div>

        <div style={{ animation: "fadeUp 400ms cubic-bezier(0.16,1,0.3,1) 280ms both" }}>
          <h1 className="mb-2 text-2xl font-bold text-white" style={{ fontFamily: "var(--font-heading)" }}>
            Email verified!
          </h1>
          <p className="mb-6 text-sm text-zinc-400 leading-relaxed">
            Your LimeL8 account is now active.<br />You&apos;re ready to sign in.
          </p>
        </div>

        <div style={{ animation: "fadeUp 400ms cubic-bezier(0.16,1,0.3,1) 380ms both" }}>
          <a
            href="/login"
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-400 to-violet-400 px-6 py-2.5 text-sm font-bold text-zinc-950 shadow-[0_0_20px_rgba(34,211,238,0.2),0_4px_12px_rgba(34,211,238,0.13)] hover:shadow-[0_0_28px_rgba(34,211,238,0.35)] transition-shadow duration-200 cursor-pointer"
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

  return (
    <>
      <style>{`
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.6); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Error icon */}
      <div className="mb-5 flex justify-center" style={{ animation: "scaleIn 500ms cubic-bezier(0.16,1,0.3,1) 150ms both" }}>
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 border border-red-500/25">
          <svg className="h-7 w-7 text-red-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
          </svg>
        </div>
      </div>

      <div style={{ animation: "fadeUp 400ms cubic-bezier(0.16,1,0.3,1) 280ms both" }}>
        <h1 className="mb-2 text-2xl font-bold text-white" style={{ fontFamily: "var(--font-heading)" }}>
          Verification failed
        </h1>
        <p className="mb-6 text-sm text-zinc-400 leading-relaxed">
          {messages[error ?? ""] ?? "Something went wrong. Please try again."}
        </p>
      </div>

      <div style={{ animation: "fadeUp 400ms cubic-bezier(0.16,1,0.3,1) 380ms both" }}>
        <a
          href="/resend-verification"
          className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-400 to-violet-400 px-6 py-2.5 text-sm font-bold text-zinc-950 shadow-[0_0_20px_rgba(34,211,238,0.2),0_4px_12px_rgba(34,211,238,0.13)] hover:shadow-[0_0_28px_rgba(34,211,238,0.35)] transition-shadow duration-200 cursor-pointer"
        >
          Resend verification email
        </a>
      </div>
    </>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4">
      <style>{`
        @keyframes bloomIn {
          from { opacity: 0; transform: scale(0.8); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
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
        className="relative w-full max-w-md rounded-2xl bg-zinc-900 border border-cyan-500/[0.27] p-8 text-center shadow-[0_0_0_1px_rgba(34,211,238,0.13),0_0_20px_rgba(34,211,238,0.13),0_0_40px_rgba(34,211,238,0.05)]"
        style={{ animation: "fadeUp 500ms cubic-bezier(0.16,1,0.3,1) 100ms both" }}
      >
        <Suspense>
          <VerifyEmailContent />
        </Suspense>
      </div>
    </div>
  );
}
