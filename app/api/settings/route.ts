import { createClient } from "@/lib/supabase/server";
import { requireApiAuth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const unauthorized = await requireApiAuth();
  if (unauthorized) return unauthorized;
  const supabase = await createClient();
  const { data } = await supabase.from("settings").select("*").limit(1).single();
  return NextResponse.json(data || {});
}

export async function PUT(req: NextRequest) {
  const unauthorized = await requireApiAuth();
  if (unauthorized) return unauthorized;
  const supabase = await createClient();
  const body = await req.json();

  const { data: existing } = await supabase.from("settings").select("id").limit(1).single();

  if (existing) {
    const { error } = await supabase.from("settings").update(body).eq("id", existing.id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  } else {
    const { error } = await supabase.from("settings").insert(body);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
