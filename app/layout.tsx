import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LimeL8",
  description: "Connect, collaborate, and sell your art",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="relative min-h-full flex flex-col bg-zinc-950 text-white overflow-x-hidden">
        {/* Cyan bloom — top-left */}
        <div
          className="pointer-events-none fixed top-0 left-0 w-[600px] h-[600px] -translate-x-1/3 -translate-y-1/3"
          style={{ background: "radial-gradient(ellipse at center, rgba(34,211,238,0.04) 0%, transparent 70%)" }}
        />
        {/* Violet bloom — bottom-right */}
        <div
          className="pointer-events-none fixed bottom-0 right-0 w-[600px] h-[600px] translate-x-1/3 translate-y-1/3"
          style={{ background: "radial-gradient(ellipse at center, rgba(167,139,250,0.04) 0%, transparent 70%)" }}
        />
        {children}
      </body>
    </html>
  );
}
