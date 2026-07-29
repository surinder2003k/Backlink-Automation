import { createClient } from "@/lib/supabase/server";
import { postToLinkedIn } from "@/lib/platforms/linkedin";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const supabase = await createClient();

  const { data: settings } = await supabase
    .from("settings")
    .select("linkedin_access_token")
    .single();

  if (!settings?.linkedin_access_token) {
    return NextResponse.json({ error: "LinkedIn not configured" }, { status: 400 });
  }

  const body = await req.json();
  const result = await postToLinkedIn(
    { accessToken: settings.linkedin_access_token },
    body.title,
    body.url,
    body.excerpt
  );

  return NextResponse.json(result);
}
