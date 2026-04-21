"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function VerifyEmailContent() {
  const params = useSearchParams();
  const success = params.get("success");
  const error = params.get("error");

  if (success) {
    return (
      <>
        <div className="mb-4 flex justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-500/10 text-3xl">
            ✓
          </div>
        </div>
        <h1 className="mb-2 text-xl font-bold text-white" style={{ fontFamily: "var(--font-heading)" }}>
          Email verified!
        </h1>
        <p className="mb-6 text-sm text-zinc-400">
          Your account is now active. You can sign in.
        </p>
        <a
          href="/login"
          className="inline-block rounded-lg bg-gradient-to-r from-cyan-400 to-violet-400 px-6 py-2 text-sm font-bold text-zinc-950"
        >
          Sign in
        </a>
      </>
    );
  }

  const messages: Record<string, string> = {
    missing: "The verification link is incomplete.",
    invalid: "This verification link is invalid or has already been used.",
    expired: "This verification link has expired. Please request a new one.",
  };

  return (
    <>
      <div className="mb-4 flex justify-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10 text-3xl">
          ✕
        </div>
      </div>
      <h1 className="mb-2 text-xl font-bold text-white" style={{ fontFamily: "var(--font-heading)" }}>
        Verification failed
      </h1>
      <p className="mb-6 text-sm text-zinc-400">
        {messages[error ?? ""] ?? "Something went wrong."}
      </p>
      <a
        href="/resend-verification"
        className="inline-block rounded-lg bg-gradient-to-r from-cyan-400 to-violet-400 px-6 py-2 text-sm font-bold text-zinc-950"
      >
        Resend verification email
      </a>
    </>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4">
      <div className="w-full max-w-md rounded-2xl bg-zinc-900 border border-cyan-500/[0.27] p-8 text-center shadow-[0_0_0_1px_rgba(34,211,238,0.13),0_0_20px_rgba(34,211,238,0.13),0_0_40px_rgba(34,211,238,0.05)]">
        <Suspense>
          <VerifyEmailContent />
        </Suspense>
      </div>
    </div>
  );
}
