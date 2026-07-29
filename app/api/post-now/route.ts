import { createClient } from "@/lib/supabase/server";
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

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const body = await req.json();
  const { postId } = body;

  if (!postId) {
    return NextResponse.json({ error: "Missing postId" }, { status: 400 });
  }

  const { data: post } = await supabase
    .from("posts")
    .select("*")
    .eq("id", postId)
    .single();

  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  const results: Record<string, any> = {};
  let allSuccess = true;

  for (const platform of post.platforms) {
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

      results[platform] = result;
      if (!result.success) allSuccess = false;
    } catch (error: any) {
      results[platform] = { success: false, error: error.message };
      allSuccess = false;
    }
  }

  const newStatus = allSuccess ? "published" : "failed";

  await supabase
    .from("posts")
    .update({
      status: newStatus,
      platform_results: results,
      published_at: allSuccess ? new Date().toISOString() : null,
    })
    .eq("id", postId);

  console.log(`[PostNow] Post ${postId}: ${newStatus}`, results);

  return NextResponse.json({
    success: allSuccess,
    status: newStatus,
    results,
  });
}
