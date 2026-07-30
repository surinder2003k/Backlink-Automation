interface DevToConfig {
  apiKey: string;
}

export async function postToDevTo(
  config: DevToConfig,
  title: string,
  url: string,
  excerpt?: string
) {
  try {
    const response = await fetch("https://dev.to/api/articles", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": config.apiKey,
      },
      body: JSON.stringify({
        article: {
          title,
          body_markdown: `${(excerpt || title).replace(new RegExp(url, "g"), `[Read the full article here](${url})`)}\n\n[Read more on our blog](${url})`,
          published: true,
          tags: ["backlink", "blog"],
        },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Dev.to API error");
    }

    return { success: true, id: String(data.id), url: data.url || `https://dev.to/${data.slug}` };
  } catch (error: any) {
    console.error("Dev.to post error:", error);
    return { success: false, error: error.message };
  }
}
