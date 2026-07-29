import { createClient } from "@/lib/supabase/server";
import { postToDevTo } from "@/lib/platforms/devto";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const supabase = await createClient();

  const { data: settings } = await supabase
    .from("settings")
    .select("devto_api_key")
    .single();

  if (!settings?.devto_api_key) {
    return NextResponse.json({ error: "Dev.to not configured" }, { status: 400 });
  }

  const body = await req.json();
  const result = await postToDevTo(
    { apiKey: settings.devto_api_key },
    body.title,
    body.url,
    body.excerpt
  );

  return NextResponse.json(result);
}
