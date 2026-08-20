import { createClient } from "@/lib/supabase/server";
import { generateArticleContent } from "@/lib/platforms/ai-content";
import { postToDevTo } from "@/lib/platforms/devto";
import { postToTumblr } from "@/lib/platforms/tumblr";
import { postToBlogger } from "@/lib/platforms/blogger";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

async function fetchSitemapUrls(sitemapUrl: string): Promise<string[]> {
  try {
    const res = await fetch(sitemapUrl, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const text = await res.text();
    const matches = text.match(/<loc>(.*?)<\/loc>/g);
    if (!matches) return [];
    
    const urls: string[] = [];
    for (const m of matches) {
      const url = m.replace(/<\/?loc>/g, "").trim();
      if (url.includes("/blog/")) urls.push(url);
    }
    return urls;
  } catch (e) {
    console.error(`[Automation] Failed to fetch ${sitemapUrl}`);
    return [];
  }
}

async function getUnusedUrlsFromSitemap(
  supabase: any,
  sitemapUrl: string,
  limit: number
): Promise<string[]> {
  // Fetch URLs from this specific sitemap
  const allUrls = await fetchSitemapUrls(sitemapUrl);
  
  if (allUrls.length === 0) return [];

  // Get already used URLs
  const { data: usedUrls } = await supabase
    .from("used_urls")
    .select("url");
  
  const usedUrlSet = new Set(usedUrls?.map((u: any) => u.url) || []);
  
  // Filter out used URLs and return up to limit
  return allUrls.filter((url) => !usedUrlSet.has(url)).slice(0, limit);
}

async function verifyBlogPost(platform: string, postUrl: string): Promise<boolean> {
  try {
    const res = await fetch(postUrl, { method: "HEAD" });
    return res.ok;
  } catch {
    return false;
  }
}

function extractTitleFromUrl(url: string): string {
  return url
    .split("/")
    .pop()
    ?.replace(/-/g, " ")
    .replace(/\.[^.]+$/, "") || "Untitled";
}

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = await createClient();
  const now = new Date();

  // Get automation config
  const { data: config } = await supabase
    .from("automation_config")
    .select("*")
    .limit(1)
    .single();

  if (!config || !config.is_enabled) {
    return NextResponse.json({ message: "Automation is disabled", count: 0 });
  }

  // Check if it's time to run
  if (config.next_run_at && new Date(config.next_run_at) > now) {
    return NextResponse.json({ message: "Not time to run yet", nextRun: config.next_run_at });
  }

  const maxPosts = config.max_posts_per_run || 3;
  const platforms = config.platforms || ["devto", "blogger", "tumblr"];
  const sitemapUrls = config.sitemap_urls || [
    "https://xylosai.vercel.app/sitemap.xml",
    "https://pathseekers.vercel.app/sitemap.xml",
    "https://surinder-web-dev.vercel.app/sitemap.xml",
  ];
  const currentIndex = config.current_sitemap_index || 0;

  // Get the current sitemap to use (rotation)
  const currentSitemapUrl = sitemapUrls[currentIndex % sitemapUrls.length];
  console.log(`[Automation] Using sitemap: ${currentSitemapUrl} (index: ${currentIndex})`);

  // Get unused URLs from current sitemap only
  const candidateUrls = await getUnusedUrlsFromSitemap(supabase, currentSitemapUrl, maxPosts);
  
  if (candidateUrls.length === 0) {
    console.log(`[Automation] No new URLs in current sitemap, trying next...`);
    
    // Try next sitemap in rotation
    let nextIndex = (currentIndex + 1) % sitemapUrls.length;
    for (let i = 0; i < sitemapUrls.length; i++) {
      const tryUrl = sitemapUrls[nextIndex];
      const urls = await getUnusedUrlsFromSitemap(supabase, tryUrl, maxPosts);
      if (urls.length > 0) {
        // Update config to use this sitemap next time
        await supabase
          .from("automation_config")
          .update({ current_sitemap_index: nextIndex })
          .eq("id", config.id);
        
        // Recursively call with new index (but avoid infinite loop)
        const nextRun = new Date(now.getTime() + (config.interval_hours || 6) * 60 * 60 * 1000);
        await supabase
          .from("automation_config")
          .update({ next_run_at: nextRun.toISOString() })
          .eq("id", config.id);
        
        return NextResponse.json({ 
          message: `No URLs in current sitemap, switched to ${tryUrl}`,
          nextRun: nextRun.toISOString(),
          switchedSitemap: true,
        });
      }
      nextIndex = (nextIndex + 1) % sitemapUrls.length;
    }
    
    // No URLs in any sitemap
    const nextRun = new Date(now.getTime() + (config.interval_hours || 6) * 60 * 60 * 1000);
    await supabase
      .from("automation_config")
      .update({ next_run_at: nextRun.toISOString() })
      .eq("id", config.id);
    
    return NextResponse.json({ message: "No new URLs available in any sitemap", count: 0 });
  }

  // Create a batch ID for this automation run
  const batchId = crypto.randomUUID();
  const results: any[] = [];

  for (let i = 0; i < Math.min(maxPosts, candidateUrls.length); i++) {
    const url = candidateUrls[i];
    const title = extractTitleFromUrl(url);

    try {
      // Generate AI content
      let articleContent;
      try {
        articleContent = await generateArticleContent(title, url, undefined);
      } catch (e) {
        articleContent = `Read about "${title}" - Visit ${url} for more details.`;
      }

      // Post to platforms
      const platformResults: Record<string, any> = {};
      let successCount = 0;

      for (const platform of platforms) {
        try {
          let result;
          switch (platform) {
            case "devto":
              result = await postToDevTo(
                { apiKey: process.env.DEVTO_API_KEY || "" },
                title,
                url,
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
                title,
                url,
                articleContent
              );
              break;
            case "tumblr":
              result = await postToTumblr(
                {
                  consumerKey: process.env.TUMBLR_CONSUMER_KEY || "",
                  consumerSecret: process.env.TUMBLR_CONSUMER_SECRET || "",
                },
                title,
                url,
                articleContent
              );
              break;
            default:
              result = { success: false, error: `Unknown platform: ${platform}` };
          }

          platformResults[platform] = result;
          
          // Verify blog was actually created
          if (result.success && result.url) {
            const verified = await verifyBlogPost(platform, result.url);
            platformResults[platform].verified = verified;
            if (verified) successCount++;
          } else if (result.success) {
            successCount++;
          }
        } catch (error: any) {
          platformResults[platform] = { success: false, error: error.message };
        }
      }

      const newStatus = successCount > 0 ? "published" : "failed";

      // Create post record
      const { data: post, error: postError } = await supabase
        .from("posts")
        .insert({
          title,
          url,
          excerpt: articleContent.substring(0, 500),
          platforms,
          status: newStatus,
          platform_results: platformResults,
          published_at: successCount > 0 ? now.toISOString() : null,
          source_type: "automated",
          automation_batch_id: batchId,
        })
        .select()
        .single();

      if (postError) {
        console.error("[Automation] Failed to create post:", postError);
        continue;
      }

      // Mark URL as used
      await supabase
        .from("used_urls")
        .insert({
          url,
          source_sitemap: currentSitemapUrl,
          post_id: post.id,
        });

      results.push({
        postId: post.id,
        title,
        url,
        status: newStatus,
        platforms: platformResults,
      });
    } catch (error: any) {
      console.error(`[Automation] Failed to process ${url}:`, error.message);
      results.push({
        url,
        error: error.message,
      });
    }
  }

  // Update automation config: 
  // - last run time
  // - next run time (+ interval hours)
  // - rotate to next sitemap for next run
  const nextIndex = (currentIndex + 1) % sitemapUrls.length;
  const nextRun = new Date(now.getTime() + (config.interval_hours || 6) * 60 * 60 * 1000);
  
  await supabase
    .from("automation_config")
    .update({ 
      last_run_at: now.toISOString(),
      next_run_at: nextRun.toISOString(),
      current_sitemap_index: nextIndex,
    })
    .eq("id", config.id);

  return NextResponse.json({ 
    processed: results.length, 
    results,
    nextRun: nextRun.toISOString(),
    nextSitemap: sitemapUrls[nextIndex],
    currentSitemapUsed: currentSitemapUrl,
  });
}