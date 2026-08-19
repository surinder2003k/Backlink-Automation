import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = await createClient();
  const { data } = await supabase.from("automation_config").select("*").limit(1).single();
  return NextResponse.json(data || {
    is_enabled: false,
    interval_hours: 6,
    max_posts_per_run: 3,
    platforms: ["devto", "blogger", "tumblr"],
    sitemap_urls: [
      "https://xylosai.vercel.app/sitemap.xml",
      "https://pathseekers.vercel.app/sitemap.xml",
      "https://surinder-web-dev.vercel.app/sitemap.xml"
    ],
    current_sitemap_index: 0,
  });
}

export async function PUT(req: NextRequest) {
  const supabase = await createClient();
  const body = await req.json();

  const { data: existing } = await supabase.from("automation_config").select("id").limit(1).single();

  if (existing) {
    const { error } = await supabase.from("automation_config").update(body).eq("id", existing.id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  } else {
    const { error } = await supabase.from("automation_config").insert(body);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const body = await req.json();
  const { action } = body;

  if (action === "trigger") {
    // Manually trigger automation run
    const cronSecret = process.env.CRON_SECRET;
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/automation/cron`, {
      headers: { Authorization: `Bearer ${cronSecret}` },
    });
    const data = await res.json();
    return NextResponse.json(data);
  }

  if (action === "reset_used_urls") {
    // Reset used URLs (for testing)
    await supabase.from("used_urls").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    return NextResponse.json({ success: true, message: "Used URLs reset" });
  }

  if (action === "reset_rotation") {
    // Reset sitemap rotation to first one
    await supabase
      .from("automation_config")
      .update({ current_sitemap_index: 0 })
      .neq("id", "00000000-0000-0000-0000-000000000000");
    return NextResponse.json({ success: true, message: "Rotation reset to first sitemap" });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}