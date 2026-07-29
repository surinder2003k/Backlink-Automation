interface BloggerConfig {
  clientId: string;
  clientSecret: string;
  refreshToken: string;
  blogId?: string;
}

export async function postToBlogger(
  config: BloggerConfig,
  title: string,
  url: string,
  excerpt?: string,
) {
  try {
    // Get access token from refresh token
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: config.clientId,
        client_secret: config.clientSecret,
        refresh_token: config.refreshToken,
        grant_type: "refresh_token",
      }).toString(),
    });
    const tokenData = (await tokenRes.json()) as any;
    if (!tokenRes.ok) {
      throw new Error(tokenData.error_description || "Failed to refresh token");
    }
    const accessToken = tokenData.access_token;

    // Get blog list to find blog ID
    let blogId = config.blogId;
    if (!blogId) {
      const blogRes = await fetch(
        "https://blogger.googleapis.com/v3/users/self/blogs",
        { headers: { Authorization: `Bearer ${accessToken}` } },
      );
      const blogData = (await blogRes.json()) as any;
      if (!blogRes.ok || !blogData?.items?.length) {
        throw new Error("No Blogger blogs found. Create one first.");
      }
      blogId = blogData.items[0].id;
    }

    // Get blog info (including URL)
    let blogUrl = "";
    const blogInfoRes = await fetch(
      `https://blogger.googleapis.com/v3/blogs/${blogId}`,
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );
    const blogInfo = (await blogInfoRes.json()) as any;
    if (blogInfoRes.ok && blogInfo?.url) {
      blogUrl = blogInfo.url.replace(/\/$/, "");
    }

    // Create blog post
    const content = `${excerpt || title}\n\n<a href="${url}">Read more</a>`;
    const postRes = await fetch(
      `https://blogger.googleapis.com/v3/blogs/${blogId}/posts/`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          content,
          labels: ["backlink", "blog"],
        }),
      },
    );
    const postData = (await postRes.json()) as any;
    if (!postRes.ok) {
      throw new Error(postData?.error?.message || "Blogger API error");
    }

    // Construct post URL from blog URL and post ID
    const postUrl = postData.url || (blogUrl ? `${blogUrl}/?p=${postData.id}` : "");

    return { success: true, id: postData.id, url: postUrl };
  } catch (error: any) {
    console.error("Blogger post error:", error);
    return { success: false, error: error.message };
  }
}
