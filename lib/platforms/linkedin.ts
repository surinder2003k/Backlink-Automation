interface LinkedInConfig {
  accessToken: string;
}

export async function postToLinkedIn(
  config: LinkedInConfig,
  title: string,
  url: string,
  excerpt?: string
) {
  try {
    const response = await fetch("https://api.linkedin.com/v2/ugcPosts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.accessToken}`,
        "X-Restli-Protocol-Version": "2.0.0",
      },
      body: JSON.stringify({
        author: "urn:li:person:me",
        lifecycleState: "PUBLISHED",
        specificContent: {
          "com.linkedin.ugc.ShareContent": {
            shareCommentary: {
              text: `${title}\n\n${excerpt || ""}`,
            },
            shareMediaCategory: "ARTICLE",
            media: [
              {
                status: "READY",
                originalUrl: url,
              },
            ],
          },
        },
        visibility: {
          "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
        },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "LinkedIn API error");
    }

    return { success: true, id: data.id };
  } catch (error: any) {
    console.error("LinkedIn post error:", error);
    return { success: false, error: error.message };
  }
}
