import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  return NextResponse.json(data || []);
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const body = await req.json();
  const { title, url, excerpt, platforms, scheduled_at, source_type, automation_batch_id } = body;

  const insertData: any = {
    title,
    url,
    excerpt,
    platforms,
    source_type: source_type || "manual",
  };
  
  if (automation_batch_id) {
    insertData.automation_batch_id = automation_batch_id;
  }
  
  if (scheduled_at) {
    insertData.scheduled_at = scheduled_at;
    insertData.status = "pending";
  }

  const { data, error } = await supabase
    .from("posts")
    .insert(insertData)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(req: NextRequest) {
  const supabase = await createClient();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const { error } = await supabase
    .from("posts")
    .delete()
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}