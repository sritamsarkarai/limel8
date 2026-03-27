import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // DATABASE_URL should be the pooled connection string (PgBouncer / Supabase transaction pooler).
    // In Prisma 7, directUrl has been removed; use DATABASE_URL for all connections.
    // For Supabase, set DATABASE_URL to the non-pooled (direct) connection string when running
    // migrations, or use the pooled string at runtime — the Supabase Prisma integration handles
    // this automatically via the DIRECT_URL env var passed to the CLI at migrate time.
    url: env("DATABASE_URL"),
  },
});
