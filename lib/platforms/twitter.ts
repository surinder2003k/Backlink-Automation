interface TwitterConfig {
  apiKey: string;
  apiSecret: string;
  accessToken: string;
  accessSecret: string;
}

export async function postToTwitter(
  config: TwitterConfig,
  title: string,
  url: string
) {
  try {
    const text = `${title}\n\n${url}`;

    const token = Buffer.from(
      `${config.apiKey}:${config.apiSecret}`
    ).toString("base64");

    const mediaResponse = await fetch(
      "https://api.twitter.com/2/tweets",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.accessToken}`,
        },
        body: JSON.stringify({ text }),
      }
    );

    const data = await mediaResponse.json();

    if (!mediaResponse.ok) {
      throw new Error(data.detail || data.title || "Twitter API error");
    }

    return { success: true, id: data.data?.id };
  } catch (error: any) {
    console.error("Twitter post error:", error);
    return { success: false, error: error.message };
  }
}
