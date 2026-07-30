import { createClient } from "@/lib/supabase/server";
import { ScheduleClient } from "./client";

export const dynamic = "force-dynamic";

export default async function SchedulePage() {
  const supabase = await createClient();

  const { data: posts } = await supabase
    .from("posts")
    .select("*")
    .order("scheduled_at", { ascending: true });

  return <ScheduleClient posts={posts || []} />;
}
