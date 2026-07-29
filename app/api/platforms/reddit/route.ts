import { createClient } from "@/lib/supabase/server";
import { postToReddit } from "@/lib/platforms/reddit";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const supabase = await createClient();

  const { data: settings } = await supabase
    .from("settings")
    .select("reddit_client_id, reddit_client_secret, reddit_username")
    .single();

  if (!settings?.reddit_client_id) {
    return NextResponse.json({ error: "Reddit not configured" }, { status: 400 });
  }

  const body = await req.json();
  const result = await postToReddit(
    {
      clientId: settings.reddit_client_id,
      clientSecret: settings.reddit_client_secret || "",
      username: settings.reddit_username || "",
    },
    body.title,
    body.url
  );

  return NextResponse.json(result);
}
