export default function CheckEmailPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4">
      <div className="w-full max-w-md rounded-2xl bg-zinc-900 border border-cyan-500/[0.27] p-8 text-center shadow-[0_0_0_1px_rgba(34,211,238,0.13),0_0_20px_rgba(34,211,238,0.13),0_0_40px_rgba(34,211,238,0.05)]">
        <div className="mb-4 flex justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-cyan-500/10 text-3xl">
            ✉️
          </div>
        </div>
        <h1 className="mb-2 text-xl font-bold text-white" style={{ fontFamily: "var(--font-heading)" }}>
          Check your email
        </h1>
        <p className="mb-6 text-sm text-zinc-400">
          We sent a verification link to your email address. Click it to activate your account.
          The link expires in 24 hours.
        </p>
        <p className="text-xs text-zinc-600">
          Didn't receive it?{" "}
          <a href="/resend-verification" className="text-cyan-400 hover:text-cyan-300 transition-colors">
            Resend verification email
          </a>
        </p>
      </div>
    </div>
  );
}
