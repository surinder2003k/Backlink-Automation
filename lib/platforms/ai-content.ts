export async function generateArticleContent(
  title: string,
  url: string,
  excerpt?: string
): Promise<string> {
  const fallback = `Learn more about ${title} at ${url}`;

  try {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      console.warn("[AI Content] OPENROUTER_API_KEY not set, using fallback");
      return fallback;
    }

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "mistralai/mistral-7b-instruct:free",
          messages: [
            {
              role: "user",
              content: `Write a well-written, informative article of 300-400 words about "${title}". ${excerpt ? `Here is some context: ${excerpt}. ` : ""}Naturally include a backlink to ${url} within the article (use it as a "Read more" link or integrate it naturally into the text). Do not use any markdown formatting. Write in plain text with clear paragraphs.`,
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`OpenRouter API returned ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No content in response");
    }

    return content;
  } catch (error: any) {
    console.error("[AI Content] Generation failed:", error.message);
    return fallback;
  }
}
