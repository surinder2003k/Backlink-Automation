interface TumblrConfig {
  consumerKey: string;
  consumerSecret: string;
}

import { linksToHtml } from "./ai-content";

async function getBearerToken(config: TumblrConfig): Promise<string> {
  const res = await fetch("https://api.tumblr.com/v2/oauth2/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: config.consumerKey,
      client_secret: config.consumerSecret,
    }).toString(),
  });
  const data = (await res.json()) as any;
  if (!res.ok || !data?.access_token) {
    throw new Error(data?.error_description || "Failed to get Tumblr bearer token");
  }
  return data.access_token;
}

export async function postToTumblr(
  config: TumblrConfig,
  title: string,
  url: string,
  excerpt?: string,
) {
  try {
    const bearerToken = await getBearerToken(config);

    const userRes = await fetch("https://api.tumblr.com/v2/user/info", {
      headers: { Authorization: `Bearer ${bearerToken}` },
    });
    const userData = (await userRes.json()) as any;
    if (!userRes.ok || !userData?.response?.user?.blogs?.length) {
      throw new Error(userData?.meta?.msg || "Failed to get Tumblr user info");
    }
    const blogName = userData.response.user.blogs[0].name;

    const postUrl = `https://api.tumblr.com/v2/blog/${blogName}/post`;
    const htmlBody = linksToHtml(`<p>${excerpt || title}</p><p><a href="${url}">Read more here</a></p>`);
    const body = new URLSearchParams({
      type: "text",
      title: title.slice(0, 250),
      body: htmlBody,
      tags: "backlink,blog,education",
    });

    const response = await fetch(postUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${bearerToken}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body.toString(),
    });
    const data = (await response.json()) as any;
    if (!response.ok) {
      throw new Error(data?.meta?.msg || `Tumblr API error: ${response.status}`);
    }
    const resp = data?.response || {};
    const idString = resp.id_string || String(resp.id || "");
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const constructedUrl = `https://www.tumblr.com/${blogName}/${idString}/${slug}`;
    return { success: true, id: idString || "ok", url: resp.post_url || constructedUrl };
  } catch (error: any) {
    console.error("Tumblr post error:", error.message);
    return { success: false, error: error.message };
  }
}
