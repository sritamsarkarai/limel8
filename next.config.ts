import type { NextConfig } from "next";

// next-auth/react reads NEXTAUTH_URL at module evaluation time during SSR.
// Without a value it throws "Invalid URL" during static page generation.
// Provide a fallback so the build succeeds; the real value from env vars
// is used at runtime.
if (!process.env.NEXTAUTH_URL) {
  process.env.NEXTAUTH_URL =
    process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000";
}

const nextConfig: NextConfig = {
  serverExternalPackages: ["@prisma/client", "prisma", "bcryptjs"],
};

export default nextConfig;
