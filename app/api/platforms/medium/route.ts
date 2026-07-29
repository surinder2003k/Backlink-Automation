import { createClient } from "@/lib/supabase/server";
import { postToMedium } from "@/lib/platforms/medium";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const supabase = await createClient();

  const { data: settings } = await supabase
    .from("settings")
    .select("medium_access_token")
    .single();

  if (!settings?.medium_access_token) {
    return NextResponse.json({ error: "Medium not configured" }, { status: 400 });
  }

  const body = await req.json();
  const result = await postToMedium(
    { accessToken: settings.medium_access_token },
    body.title,
    body.url,
    body.excerpt
  );

  return NextResponse.json(result);
}
