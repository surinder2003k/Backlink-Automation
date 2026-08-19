import { createClient } from "@/lib/supabase/server";
import { DashboardClient } from "./client";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data: posts } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  const { data: automation } = await supabase
    .from("automation_config")
    .select("*")
    .limit(1)
    .single();

  const { data: usedUrls } = await supabase
    .from("used_urls")
    .select("url", { count: "exact" });

  const totalPosts = posts?.length || 0;
  const scheduled = posts?.filter((p) => p.status === "pending").length || 0;
  const published = posts?.filter((p) => p.status === "published").length || 0;
  const failed = posts?.filter((p) => p.status === "failed").length || 0;
  const successRate = totalPosts > 0 ? Math.round((published / totalPosts) * 100) : 0;
  const automatedPosts = posts?.filter((p) => p.source_type === "automated").length || 0;

  return (
    <DashboardClient
      totalPosts={totalPosts}
      scheduled={scheduled}
      published={published}
      failed={failed}
      successRate={successRate}
      automatedPosts={automatedPosts}
      usedUrlsCount={usedUrls?.length || 0}
      automation={automation}
      recentPosts={posts?.slice(0, 5) || []}
    />
  );
}