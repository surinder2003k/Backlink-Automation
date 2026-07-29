import { createClient as createSupabaseClient } from "@supabase/supabase-js";

export function createClient() {
  return createSupabaseClient(
    process.env.XYLOS_SUPABASE_URL!,
    process.env.XYLOS_SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: { autoRefreshToken: false, persistSession: false },
    }
  );
}

export function createServiceClient() {
  return createSupabaseClient(
    process.env.XYLOS_SUPABASE_URL!,
    process.env.XYLOS_SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: { autoRefreshToken: false, persistSession: false },
    }
  );
}
