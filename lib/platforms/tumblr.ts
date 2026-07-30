import crypto from "crypto";

interface TumblrConfig {
  consumerKey: string;
  consumerSecret: string;
  accessToken: string;
  accessSecret: string;
}

function encode(s: string): string {
  return encodeURIComponent(s)
    .replace(/!/g, "%21")
    .replace(/'/g, "%27")
    .replace(/\(/g, "%28")
    .replace(/\)/g, "%29")
    .replace(/\*/g, "%2A");
}

function buildOAuthHeader(
  method: string,
  url: string,
  params: Record<string, string>,
  consumerKey: string,
  consumerSecret: string,
  accessToken: string,
  accessSecret: string,
): string {
  const nonce = crypto.randomBytes(16).toString("hex");
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const oauth: Record<string, string> = {
    oauth_consumer_key: consumerKey,
    oauth_nonce: nonce,
    oauth_signature_method: "HMAC-SHA1",
    oauth_timestamp: timestamp,
    oauth_token: accessToken,
    oauth_version: "1.0",
  };
  const all = { ...oauth, ...params };
  const paramString = Object.keys(all)
    .sort()
    .map((k) => `${encode(k)}=${encode(all[k])}`)
    .join("&");
  const base = `${method}&${encode(url)}&${encode(paramString)}`;
  const key = `${encode(consumerSecret)}&${encode(accessSecret)}`;
  oauth.oauth_signature = crypto.createHmac("sha1", key).update(base).digest("base64");
  return (
    "OAuth " +
    Object.keys(oauth)
      .sort()
      .map((k) => `${encode(k)}="${encode(oauth[k])}"`)
      .join(", ")
  );
}

export async function postToTumblr(
  config: TumblrConfig,
  title: string,
  url: string,
  excerpt?: string,
) {
  try {
    const userUrl = "https://api.tumblr.com/v2/user/info";
    const userAuth = buildOAuthHeader("GET", userUrl, {}, config.consumerKey, config.consumerSecret, config.accessToken, config.accessSecret);
    const userRes = await fetch(userUrl, { headers: { Authorization: userAuth } });
    const userData = (await userRes.json()) as any;
    if (!userRes.ok || !userData?.response?.user?.blogs?.length) {
      throw new Error(userData?.meta?.msg || "Failed to get Tumblr user info");
    }
    const blogName = userData.response.user.blogs[0].name;

    const postUrl = `https://api.tumblr.com/v2/blog/${blogName}/post`;
    const htmlBody = `<p>${excerpt || title}</p><p><a href="${url}">Read more here</a></p>`;
    const bodyParams: Record<string, string> = {
      type: "text",
      title: title.slice(0, 250),
      body: htmlBody,
      tags: "backlink,blog,education",
    };

    const auth = buildOAuthHeader("POST", postUrl, bodyParams, config.consumerKey, config.consumerSecret, config.accessToken, config.accessSecret);
    const response = await fetch(postUrl, {
      method: "POST",
      headers: {
        Authorization: auth,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams(bodyParams).toString(),
    });
    const data = (await response.json()) as any;
    if (!response.ok || data?.meta?.status !== 201) {
      throw new Error(data?.meta?.msg || `Tumblr API error: ${response.status}`);
    }
    const postId = data?.response?.id;
    const postUrl2 = `https://${blogName}.tumblr.com/post/${postId}`;
    return { success: true, id: String(postId || "ok"), url: data?.response?.post_url || postUrl2 };
  } catch (error: any) {
    console.error("Tumblr post error:", error.message);
    return { success: false, error: error.message };
  }
}
