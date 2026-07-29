import { createServiceClient } from "@/lib/supabase/server";
import { postToTwitter } from "@/lib/platforms/twitter";
import { postToLinkedIn } from "@/lib/platforms/linkedin";
import { postToReddit } from "@/lib/platforms/reddit";
import { postToMedium } from "@/lib/platforms/medium";
import { postToDevTo } from "@/lib/platforms/devto";
import { postToTumblr } from "@/lib/platforms/tumblr";
import { postToBlogger } from "@/lib/platforms/blogger";
import { postToHashnode } from "@/lib/platforms/hashnode";
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
    const platformResults: Record<string, any> = {};
    let allSuccess = true;

    for (const platform of schedule.platforms) {
      try {
        let result;
        switch (platform) {
          case "twitter":
            result = await postToTwitter(
              {
                apiKey: process.env.TWITTER_API_KEY || "",
                apiSecret: process.env.TWITTER_API_SECRET || "",
                accessToken: process.env.TWITTER_ACCESS_TOKEN || "",
                accessSecret: process.env.TWITTER_ACCESS_SECRET || "",
              },
              post.title,
              post.url
            );
            break;
          case "linkedin":
            result = await postToLinkedIn(
              { accessToken: process.env.LINKEDIN_ACCESS_TOKEN || "" },
              post.title,
              post.url,
              post.excerpt || undefined
            );
            break;
          case "reddit":
            result = await postToReddit(
              {
                clientId: process.env.REDDIT_CLIENT_ID || "",
                clientSecret: process.env.REDDIT_CLIENT_SECRET || "",
                username: process.env.REDDIT_USERNAME || "",
              },
              post.title,
              post.url
            );
            break;
          case "medium":
            result = await postToMedium(
              { accessToken: process.env.MEDIUM_ACCESS_TOKEN || "" },
              post.title,
              post.url,
              post.excerpt || undefined
            );
            break;
          case "devto":
            result = await postToDevTo(
              { apiKey: process.env.DEVTO_API_KEY || "" },
              post.title,
              post.url,
              post.excerpt || undefined
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
              post.excerpt || undefined
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
              post.excerpt || undefined
            );
            break;
          case "hashnode":
            result = await postToHashnode(
              { apiKey: process.env.HASHNODE_API_KEY || "" },
              post.title,
              post.url,
              post.excerpt || undefined
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
