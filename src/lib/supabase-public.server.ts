import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

/** Publishable-key client for public, RLS-respecting reads inside server handlers. */
export function getPublicSupabase() {
  return createClient<Database>(
    process.env["SUPABASE_URL"]!,
    process.env["SUPABASE_PUBLISHABLE_KEY"]!,
    {
      auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
    },
  );
}
