import { generateArticleContent } from "@/lib/platforms/ai-content";
import { requireApiAuth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const unauthorized = await requireApiAuth();
  if (unauthorized) return unauthorized;

  try {
    const body = await req.json();
    const { title, url, excerpt } = body;

    if (!title || !url) {
      return NextResponse.json(
        { error: "Missing required fields: title, url" },
        { status: 400 }
      );
    }

    const content = await generateArticleContent(title, url, excerpt);
    return NextResponse.json({ content });
  } catch (error: any) {
    console.error("[Generate Content] Error:", error.message);
    return NextResponse.json(
      { error: error.message || "Failed to generate content" },
      { status: 500 }
    );
  }
}
