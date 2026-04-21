export default function CheckEmailPage() {
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
        @keyframes pulseRing {
          0%, 100% { box-shadow: 0 0 0 0 rgba(34,211,238,0.25); }
          50%       { box-shadow: 0 0 0 10px rgba(34,211,238,0); }
        }
      `}</style>

      {/* Background bloom */}
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
        {/* Icon */}
        <div className="mb-5 flex justify-center" style={{ animation: "fadeUp 400ms cubic-bezier(0.16,1,0.3,1) 200ms both" }}>
          <div
            className="flex h-16 w-16 items-center justify-center rounded-full bg-cyan-500/10 border border-cyan-500/20"
            style={{ animation: "pulseRing 2.5s ease-in-out 800ms infinite" }}
          >
            <svg className="h-7 w-7 text-cyan-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
            </svg>
          </div>
        </div>

        {/* Heading */}
        <div style={{ animation: "fadeUp 400ms cubic-bezier(0.16,1,0.3,1) 280ms both" }}>
          <h1 className="mb-2 text-2xl font-bold text-white" style={{ fontFamily: "var(--font-heading)" }}>
            Check your email
          </h1>
          <p className="text-sm text-zinc-400 leading-relaxed">
            We sent a verification link to your email address.<br />
            Click it to activate your account — it expires in{" "}
            <span className="text-zinc-300 font-medium">24 hours</span>.
          </p>
        </div>

        {/* Divider */}
        <div className="my-6 border-t border-zinc-800" style={{ animation: "fadeUp 400ms cubic-bezier(0.16,1,0.3,1) 360ms both" }} />

        {/* Resend */}
        <p
          className="text-xs text-zinc-500"
          style={{ animation: "fadeUp 400ms cubic-bezier(0.16,1,0.3,1) 420ms both" }}
        >
          Didn&apos;t receive it?{" "}
          <a
            href="/resend-verification"
            className="text-cyan-400 hover:text-cyan-300 transition-colors duration-150 font-medium"
          >
            Resend verification email
          </a>
        </p>
      </div>
    </div>
  );
}
