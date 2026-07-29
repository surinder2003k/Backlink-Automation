import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.XYLOS_SUPABASE_URL!,
    process.env.XYLOS_SUPABASE_ANON_KEY!
  );
}
