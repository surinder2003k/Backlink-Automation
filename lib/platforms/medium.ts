interface MediumConfig {
  accessToken: string;
}

export async function postToMedium(
  config: MediumConfig,
  title: string,
  url: string,
  excerpt?: string
) {
  try {
    const userResponse = await fetch("https://api.medium.com/v1/me", {
      headers: {
        Authorization: `Bearer ${config.accessToken}`,
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
    });

    const userData = await userResponse.json();

    if (!userResponse.ok) {
      throw new Error(userData.errors?.[0]?.message || "Medium auth failed");
    }

    const userId = userData.data.id;

    const postResponse = await fetch(
      `https://api.medium.com/v1/users/${userId}/posts`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${config.accessToken}`,
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({
          title,
          contentFormat: "html",
          content: `<p>${excerpt || ""}</p><p><a href="${url}">Read more</a></p>`,
          canonicalUrl: url,
          publishStatus: "public",
        }),
      }
    );

    const postData = await postResponse.json();

    if (!postResponse.ok) {
      throw new Error(postData.errors?.[0]?.message || "Medium post failed");
    }

    return { success: true, id: postData.data.id };
  } catch (error: any) {
    console.error("Medium post error:", error);
    return { success: false, error: error.message };
  }
}
