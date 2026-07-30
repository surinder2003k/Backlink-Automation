import { createClient } from "@/lib/supabase/server";
import { postToDevTo } from "@/lib/platforms/devto";
import { postToTumblr } from "@/lib/platforms/tumblr";
import { postToBlogger } from "@/lib/platforms/blogger";
import { generateArticleContent } from "@/lib/platforms/ai-content";
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

  // Generate AI content for the post
  let articleContent = post.excerpt || post.title;
  try {
    articleContent = await generateArticleContent(post.title, post.url, post.excerpt || undefined);
    console.log(`[PostNow] AI content generated for post ${postId}`);
  } catch (e) {
    console.log(`[PostNow] AI content generation failed, using fallback`);
    articleContent = `Read about "${post.title}" - ${post.excerpt || post.title}. Visit ${post.url} for more details.`;
  }

  const results: Record<string, any> = {};
  let allSuccess = true;

  for (const platform of post.platforms) {
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

      results[platform] = result;
      if (!result.success) allSuccess = false;
    } catch (error: any) {
      results[platform] = { success: false, error: error.message };
      allSuccess = false;
    }
  }

  const successCount = Object.values(results).filter((r: any) => r.success).length;
  const newStatus = successCount > 0 ? "published" : "failed";

  await supabase
    .from("posts")
    .update({
      status: newStatus,
      platform_results: results,
      published_at: successCount > 0 ? new Date().toISOString() : null,
    })
    .eq("id", postId);

  console.log(`[PostNow] Post ${postId}: ${newStatus} (${successCount}/${Object.keys(results).length} platforms)`);

  return NextResponse.json({
    success: allSuccess,
    status: newStatus,
    results,
  });
}
