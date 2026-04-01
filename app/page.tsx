import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-950 flex flex-col">
      {/* Navbar */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-zinc-800 bg-zinc-900">
        <span className="text-xl font-bold text-white" style={{ fontFamily: "var(--font-heading)" }}>
          Lime<span className="text-cyan-400">L8</span>
        </span>
        <div className="flex gap-3 items-center">
          <Link
            href="/login"
            className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            Log in
          </Link>
          <Link
            href="/register"
            className="px-4 py-2 text-sm font-bold text-zinc-950 bg-cyan-500 rounded-lg hover:bg-cyan-600 transition-colors cursor-pointer"
          >
            Sign up free
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 py-24 text-center">
        <div className="inline-block mb-6 px-4 py-1.5 rounded-full text-xs font-semibold text-cyan-400 bg-cyan-950 border border-cyan-500/25">
          Now in open beta — free to join
        </div>
        <h1
          className="text-5xl sm:text-6xl font-extrabold text-white max-w-3xl leading-tight tracking-tight"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Where artists{" "}
          <span className="text-cyan-400">connect &amp; create</span>
        </h1>
        <p className="mt-6 text-lg text-zinc-400 max-w-xl leading-relaxed">
          Discover collaborators, share your work, and sell your art — all in one place built for creatives.
        </p>
        <div className="mt-10 flex gap-4 flex-wrap justify-center">
          <Link
            href="/register"
            className="px-7 py-3 text-base font-bold text-zinc-950 bg-cyan-500 rounded-xl hover:bg-cyan-600 transition-colors cursor-pointer"
          >
            Get started free
          </Link>
          <Link
            href="/marketplace"
            className="px-7 py-3 text-base font-semibold text-zinc-300 border border-zinc-700 rounded-xl hover:border-zinc-500 hover:text-white transition-colors cursor-pointer"
          >
            Browse marketplace
          </Link>
        </div>
      </section>

      {/* Stats bar */}
      <div className="border-t border-b border-zinc-800 bg-zinc-900 py-6 px-6">
        <div className="max-w-4xl mx-auto flex flex-wrap justify-center gap-12">
          {[
            { number: "12,400+", label: "Artists joined" },
            { number: "$0", label: "Fees on sales under $200" },
            { number: "8", label: "Creative disciplines" },
            { number: "Real-time", label: "Messaging & collabs" },
          ].map(({ number, label }) => (
            <div key={label} className="text-center">
              <div className="text-2xl font-extrabold text-cyan-400" style={{ fontFamily: "var(--font-heading)" }}>
                {number}
              </div>
              <div className="text-xs text-zinc-500 mt-1">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <section className="px-6 py-20 max-w-5xl mx-auto w-full">
        <div className="text-center mb-12">
          <h2
            className="text-3xl font-extrabold text-white tracking-tight"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Everything for creatives
          </h2>
          <p className="mt-3 text-zinc-500">Tools built around how artists actually work and collaborate.</p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: "Discover Artists",
              desc: "Find collaborators by discipline, location, and availability. Filter to exactly who you need.",
              icon: (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
              ),
            },
            {
              title: "Sell Your Work",
              desc: "List digital downloads or physical pieces. Zero fees on sales under $200.",
              icon: (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/>
                </svg>
              ),
            },
            {
              title: "Real-time Messaging",
              desc: "DM artists directly. Pitch collaborations, discuss projects, build your network.",
              icon: (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
              ),
            },
            {
              title: "Artist Feed",
              desc: "Share updates, works-in-progress, and announcements. Follow the artists you love.",
              icon: (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              ),
            },
            {
              title: "Artist Groups",
              desc: "Create or join collectives. Manage group profiles, shared listings, and projects.",
              icon: (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>
                </svg>
              ),
            },
            {
              title: "Availability Status",
              desc: "Let collaborators know when you're open for new projects, commissions, or gigs.",
              icon: (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                </svg>
              ),
            },
          ].map(({ title, desc, icon }) => (
            <div key={title} className="bg-zinc-800 border border-zinc-700 rounded-xl p-6 flex flex-col gap-4">
              <div className="w-10 h-10 rounded-lg bg-cyan-950 border border-cyan-500/25 flex items-center justify-center text-cyan-400">
                {icon}
              </div>
              <h3 className="font-bold text-white" style={{ fontFamily: "var(--font-heading)" }}>{title}</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20 text-center border-t border-zinc-800 bg-zinc-900">
        <h2
          className="text-4xl font-extrabold text-white tracking-tight"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Ready to <span className="text-cyan-400">create</span>?
        </h2>
        <p className="mt-4 text-zinc-400 max-w-md mx-auto">
          Join thousands of artists already connecting and selling on LimeL8.
        </p>
        <Link
          href="/register"
          className="inline-block mt-8 px-8 py-4 text-base font-bold text-zinc-950 bg-cyan-500 rounded-xl hover:bg-cyan-600 transition-colors cursor-pointer"
        >
          Start for free — no credit card
        </Link>
      </section>

      {/* Footer */}
      <footer className="px-6 py-6 text-center text-sm text-zinc-600 border-t border-zinc-800 bg-zinc-900">
        &copy; {new Date().getFullYear()} LimeL8. Built for artists.
      </footer>
    </main>
  );
}
