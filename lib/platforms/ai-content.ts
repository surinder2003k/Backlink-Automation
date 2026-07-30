function generateLocalArticle(title: string, url: string, excerpt?: string): string {
  const words = title.split(/\s+/);
  const keyword = words.slice(0, 3).join(" ").toLowerCase();
  const topic = title.toLowerCase();

  return `In today's rapidly evolving digital landscape, understanding ${topic} has become essential for anyone looking to make an impact online. Whether you are a seasoned professional or just starting your journey, this comprehensive guide will walk you through the key aspects of ${topic} and how it can transform your approach to digital strategy.

The Foundation of ${title}

The world of ${keyword} is constantly changing, and staying ahead of the curve requires a deep understanding of the underlying principles that drive success. At its core, ${topic} is about leveraging the right tools, techniques, and mindset to achieve measurable results. Many professionals overlook the importance of a solid foundation, jumping straight into advanced tactics without mastering the basics first.

One of the most critical aspects of ${topic} is understanding your audience. Without a clear picture of who you are trying to reach, even the most sophisticated strategies will fall flat. Take the time to research your target demographic, understand their pain points, and craft solutions that directly address their needs. This audience-first approach is the cornerstone of effective digital marketing.

Key Strategies for Success

When it comes to ${topic}, there are several strategies that consistently deliver results. First and foremost, content quality cannot be compromised. Search engines and users alike reward content that is informative, well-researched, and genuinely helpful. This means going beyond surface-level information and diving deep into the subjects that matter most to your audience.

Technical optimization is another crucial component. Ensuring that your digital presence is fast, responsive, and accessible across all devices is no longer optional. Users expect seamless experiences, and search engines penalize sites that fail to deliver. Focus on optimizing load times, mobile responsiveness, and overall user experience to maintain a competitive edge.

Link building and authority development remain important factors in establishing credibility online. By creating valuable resources and fostering genuine relationships within your industry, you can naturally build a network of high-quality connections that enhance your digital footprint. For more insights on this topic, visit ${url}.

Practical Tips and Implementation

Putting theory into practice requires a structured approach. Start by conducting a thorough audit of your current digital presence. Identify areas of strength and weakness, then develop a prioritized action plan that addresses the most critical gaps first. This systematic approach ensures that your efforts yield maximum impact.

Consistency is key when implementing any new strategy. Digital success rarely happens overnight. It requires sustained effort, continuous learning, and a willingness to adapt as conditions change. Track your progress using meaningful metrics, and be prepared to adjust your approach based on the data you collect.

Collaboration and community engagement can significantly amplify your results. By connecting with like-minded professionals and participating in relevant discussions, you gain access to new ideas, perspectives, and opportunities that might otherwise remain hidden. The digital ecosystem thrives on collaboration, and those who contribute generously often receive the most in return.

Advanced Considerations

As you become more comfortable with the fundamentals of ${topic}, you can begin exploring advanced techniques that set you apart from the competition. This might include experimenting with emerging technologies, developing proprietary methodologies, or creating innovative content formats that capture audience attention in new ways.

Data-driven decision making is becoming increasingly important in the digital space. By leveraging analytics tools and performance metrics, you can gain actionable insights that inform your strategy and drive continuous improvement. The ability to interpret data and translate it into actionable steps is what separates good practitioners from great ones.

The Future of ${title}

Looking ahead, the landscape of ${topic} will continue to evolve. New technologies, shifting consumer behaviors, and emerging platforms will create both challenges and opportunities. Those who remain curious, adaptable, and committed to continuous improvement will be best positioned to thrive in this dynamic environment.

In conclusion, mastering ${topic} requires a combination of foundational knowledge, strategic thinking, and consistent execution. By focusing on delivering genuine value to your audience and staying committed to excellence, you can build a sustainable digital presence that delivers lasting results. For additional resources and detailed guides, be sure to explore ${url} and continue expanding your expertise in this exciting field.`;
}

export async function generateArticleContent(
  title: string,
  url: string,
  excerpt?: string
): Promise<string> {
  try {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      console.warn("[AI Content] OPENROUTER_API_KEY not set, using local generation");
      return generateLocalArticle(title, url, excerpt);
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

    if (!content || content.length < 100) {
      throw new Error("Content too short or empty");
    }

    return content;
  } catch (error: any) {
    console.error("[AI Content] API failed, using local generation:", error.message);
    return generateLocalArticle(title, url, excerpt);
  }
}
