import { createClient } from "@/lib/supabase/server";
import { postToTwitter } from "@/lib/platforms/twitter";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const supabase = await createClient();

  const { data: settings } = await supabase
    .from("settings")
    .select("twitter_api_key, twitter_api_secret, twitter_access_token, twitter_access_secret")
    .single();

  if (!settings?.twitter_api_key) {
    return NextResponse.json({ error: "Twitter not configured" }, { status: 400 });
  }

  const body = await req.json();
  const result = await postToTwitter(
    {
      apiKey: settings.twitter_api_key,
      apiSecret: settings.twitter_api_secret,
      accessToken: settings.twitter_access_token || "",
      accessSecret: settings.twitter_access_secret || "",
    },
    body.title,
    body.url
  );

  return NextResponse.json(result);
}
