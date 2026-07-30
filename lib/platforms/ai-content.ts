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
          max_tokens: 2000,
          messages: [
            {
              role: "user",
              content: `Write a comprehensive, well-structured article of at least 700 words about "${title}". ${excerpt ? `Here is some context: ${excerpt}. ` : ""}The article should have: an engaging introduction, multiple informative sections with detailed explanations, practical examples or tips, and a conclusion. Naturally include a backlink to ${url} within the article (use it as a reference link or integrate it naturally). Do not use any markdown formatting like # or **. Write in plain text with clear paragraphs separated by blank lines. Make it informative, engaging, and valuable to readers.`,
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
