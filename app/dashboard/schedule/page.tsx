import { createClient } from "@/lib/supabase/server";
import { ScheduleClient } from "./client";

export const dynamic = "force-dynamic";

export default async function SchedulePage() {
  const supabase = await createClient();

  const { data: schedules } = await supabase
    .from("schedules")
    .select("*")
    .order("time_slot", { ascending: true });

  return <ScheduleClient schedules={schedules || []} />;
}
