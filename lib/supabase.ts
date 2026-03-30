import { createClient } from "@supabase/supabase-js";

// Browser client for Realtime subscriptions — uses anon key
export function createBrowserSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
