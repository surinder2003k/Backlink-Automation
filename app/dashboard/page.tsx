import { createClient } from "@/lib/supabase/server";
import { DashboardClient } from "./client";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data: posts } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  const totalPosts = posts?.length || 0;
  const scheduled = posts?.filter((p) => p.status === "pending").length || 0;
  const published = posts?.filter((p) => p.status === "published").length || 0;
  const successRate = totalPosts > 0 ? Math.round((published / totalPosts) * 100) : 0;

  return (
    <DashboardClient
      totalPosts={totalPosts}
      scheduled={scheduled}
      successRate={successRate}
      recentCount={totalPosts}
    />
  );
}
