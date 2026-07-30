import { createClient } from "@/lib/supabase/server";
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

  const supabase = createClient();
  const now = new Date();

  const { data: pendingPosts } = await supabase
    .from("posts")
    .select("*")
    .eq("status", "pending")
    .lte("scheduled_at", now.toISOString())
    .not("scheduled_at", "is", null)
    .order("scheduled_at", { ascending: true });

  if (!pendingPosts || pendingPosts.length === 0) {
    return NextResponse.json({ message: "No pending scheduled posts", count: 0 });
  }

  const results: any[] = [];

  for (const post of pendingPosts) {
    let articleContent = post.excerpt || post.title;
    try {
      articleContent = await generateArticleContent(post.title, post.url, post.excerpt || undefined);
    } catch (e) {
      articleContent = `Read about "${post.title}" - ${post.excerpt || post.title}. Visit ${post.url} for more details.`;
    }

    const platformResults: Record<string, any> = {};
    let allSuccess = true;

    for (const platform of post.platforms || []) {
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

    const successCount = Object.values(platformResults).filter((r: any) => r.success).length;
    const newStatus = successCount > 0 ? "published" : "failed";

    await supabase
      .from("posts")
      .update({
        status: newStatus,
        platform_results: platformResults,
        published_at: successCount > 0 ? now.toISOString() : null,
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
