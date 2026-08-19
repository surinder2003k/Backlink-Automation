import { createClient } from "@/lib/supabase/server";
import { SettingsClient } from "./client";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const supabase = await createClient();
  
  const [{ data: settings }, { data: automation }] = await Promise.all([
    supabase.from("settings").select("*").limit(1).single(),
    supabase.from("automation_config").select("*").limit(1).single(),
  ]);

  return <SettingsClient settings={settings || {}} automation={automation || {}} />;
}