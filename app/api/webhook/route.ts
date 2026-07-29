import { createServiceClient } from "@/lib/supabase/server";
import { postToDevTo } from "@/lib/platforms/devto";
import { postToTumblr } from "@/lib/platforms/tumblr";
import { postToBlogger } from "@/lib/platforms/blogger";
import { generateArticleContent } from "@/lib/platforms/ai-content";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServiceClient();
  const now = new Date();
  const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

  const { data: schedules } = await supabase
    .from("schedules")
    .select("*")
    .eq("time_slot", currentTime)
    .eq("is_active", true);

  if (!schedules || schedules.length === 0) {
    return NextResponse.json({ message: "No pending schedules", time: currentTime });
  }

  const results: any[] = [];

  for (const schedule of schedules) {
    const { data: pendingPosts } = await supabase
      .from("posts")
      .select("*")
      .eq("status", "pending")
      .order("created_at", { ascending: true })
      .limit(1);

    if (!pendingPosts || pendingPosts.length === 0) continue;

    const post = pendingPosts[0];

    // Generate AI content
    let articleContent = post.excerpt || post.title;
    try {
      articleContent = await generateArticleContent(post.title, post.url, post.excerpt || undefined);
    } catch (e) {
      articleContent = `Read about "${post.title}" - ${post.excerpt || post.title}. Visit ${post.url} for more details.`;
    }

    const platformResults: Record<string, any> = {};
    let allSuccess = true;

    for (const platform of schedule.platforms) {
      try {
        let result;
        switch (platform) {
          case "devto":
            result = await postToDevTo(
              { apiKey: process.env.DEVTO_API_KEY || "" },
              post.title,
              post.url,
              articleContent
            );
            break;
          case "blogger":
            result = await postToBlogger(
              {
                clientId: process.env.BLOGGER_CLIENT_ID || "",
                clientSecret: process.env.BLOGGER_CLIENT_SECRET || "",
                refreshToken: process.env.BLOGGER_REFRESH_TOKEN || "",
                blogId: process.env.BLOGGER_BLOG_ID || "",
              },
              post.title,
              post.url,
              articleContent
            );
            break;
          case "tumblr":
            result = await postToTumblr(
              {
                consumerKey: process.env.TUMBLR_CONSUMER_KEY || "",
                consumerSecret: process.env.TUMBLR_CONSUMER_SECRET || "",
                accessToken: process.env.TUMBLR_ACCESS_TOKEN || "",
                accessSecret: process.env.TUMBLR_ACCESS_SECRET || "",
              },
              post.title,
              post.url,
              articleContent
            );
            break;
          default:
            result = { success: false, error: `Unknown platform: ${platform}` };
        }
        platformResults[platform] = result;
        if (!result.success) allSuccess = false;
      } catch (error: any) {
        platformResults[platform] = { success: false, error: error.message };
        allSuccess = false;
      }
    }

    const newStatus = allSuccess ? "published" : "failed";

    await supabase
      .from("posts")
      .update({
        status: newStatus,
        platform_results: platformResults,
        published_at: allSuccess ? now.toISOString() : null,
      })
      .eq("id", post.id);

    results.push({
      postId: post.id,
      status: newStatus,
      platforms: platformResults,
    });
  }

  return NextResponse.json({ processed: results.length, results });
}
