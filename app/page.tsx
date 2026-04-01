import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-white flex flex-col">
      <header className="px-6 py-4 flex items-center justify-between border-b border-gray-100">
        <span className="text-xl font-bold text-gray-900">LimeL8</span>
        <div className="flex gap-3">
          <Link
            href="/login"
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
          >
            Log in
          </Link>
          <Link
            href="/register"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Sign up
          </Link>
        </div>
      </header>

      <section className="flex-1 flex flex-col items-center justify-center px-6 py-24 text-center">
        <h1 className="text-5xl font-bold text-gray-900 max-w-2xl leading-tight">
          Connect, collaborate, and sell your art
        </h1>
        <p className="mt-6 text-xl text-gray-500 max-w-xl">
          LimeL8 is the platform for musicians, painters, photographers, and digital artists to find collaborators, grow an audience, and sell their work.
        </p>
        <div className="mt-10 flex gap-4">
          <Link
            href="/register"
            className="px-6 py-3 text-base font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            Get started free
          </Link>
          <Link
            href="/marketplace"
            className="px-6 py-3 text-base font-semibold text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Browse marketplace
          </Link>
        </div>
      </section>

      <section className="bg-gray-50 px-6 py-20">
        <div className="max-w-5xl mx-auto grid gap-8 sm:grid-cols-3 text-center">
          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-gray-900">Discover artists</h2>
            <p className="text-gray-500 text-sm">Search by artist type, location, and availability. Find your next collaborator.</p>
          </div>
          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-gray-900">Sell your work</h2>
            <p className="text-gray-500 text-sm">List digital downloads or physical pieces. No fees on sales under $200.</p>
          </div>
          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-gray-900">Real-time messaging</h2>
            <p className="text-gray-500 text-sm">Connect directly with other artists. Start a conversation from any profile.</p>
          </div>
        </div>
      </section>

      <footer className="px-6 py-6 text-center text-sm text-gray-400 border-t border-gray-100">
        &copy; {new Date().getFullYear()} LimeL8
      </footer>
    </main>
  );
}
