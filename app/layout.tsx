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
      <body className="min-h-full flex flex-col bg-zinc-950 text-white">{children}</body>
    </html>
  );
}
