interface HashnodeConfig {
  apiKey: string;
}

export async function postToHashnode(
  config: HashnodeConfig,
  title: string,
  url: string,
  excerpt?: string,
) {
  try {
    // Get user's publication info
    const userRes = await fetch("https://api.hashnode.com", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: config.apiKey,
      },
      body: JSON.stringify({
        query: `query { me { publication { id, domain } } }`,
      }),
    });
    const userData = (await userRes.json()) as any;
    const publicationId = userData?.data?.me?.publication?.id;
    if (!publicationId) {
      throw new Error("No Hashnode publication found. Create one first.");
    }

    // Create post
    const content = `${excerpt || title}\n\n[Read more](${url})`;
    const postRes = await fetch("https://api.hashnode.com", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: config.apiKey,
      },
      body: JSON.stringify({
        query: `mutation CreatePost($input: CreatePostInput!) { createPost(input: $input) { post { id, url } } }`,
        variables: {
          input: {
            title,
            contentMarkdown: content,
            tags: [{ slug: "backlink" }, { slug: "blog" }],
            publicationId,
          },
        },
      }),
    });
    const postData = (await postRes.json()) as any;
    if (postData?.errors) {
      throw new Error(postData.errors[0]?.message || "Hashnode API error");
    }
    return { success: true, id: postData?.data?.createPost?.post?.id || "ok" };
  } catch (error: any) {
    console.error("Hashnode post error:", error);
    return { success: false, error: error.message };
  }
}
