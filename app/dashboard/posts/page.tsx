import { createClient } from "@/lib/supabase/server";
import { PostsTableClient } from "./client";

export const dynamic = "force-dynamic";

export default async function PostsPage() {
  const supabase = await createClient();

  const { data: posts } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  return <PostsTableClient posts={posts || []} />;
}