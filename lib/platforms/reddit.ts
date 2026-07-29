interface RedditConfig {
  clientId: string;
  clientSecret: string;
  username: string;
}

export async function postToReddit(
  config: RedditConfig,
  title: string,
  url: string
) {
  try {
    const auth = Buffer.from(
      `${config.clientId}:${config.clientSecret}`
    ).toString("base64");

    const tokenResponse = await fetch("https://www.reddit.com/api/v1/access_token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "XylosBacklinks/1.0",
      },
      body: `grant_type=password&username=${config.username}&password=`,
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      throw new Error(tokenData.error || "Reddit auth failed");
    }

    const accessToken = tokenData.access_token;

    const subreddit = "test"; // configurable subreddit

    const postResponse = await fetch(
      `https://oauth.reddit.com/api/submit`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/x-www-form-urlencoded",
          "User-Agent": "XylosBacklinks/1.0",
        },
        body: new URLSearchParams({
          sr: subreddit,
          kind: "link",
          title: title,
          url: url,
          resubmit: "true",
        }),
      }
    );

    const postData = await postResponse.json();

    if (!postResponse.ok || postData.error) {
      throw new Error(postData.error || "Reddit post failed");
    }

    return { success: true, id: postData.data?.id };
  } catch (error: any) {
    console.error("Reddit post error:", error);
    return { success: false, error: error.message };
  }
}
