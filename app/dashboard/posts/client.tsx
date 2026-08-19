"use client";

import { useRouter } from "next/navigation";
import { PostsTable } from "@/components/dashboard/posts-table";

interface PostsTableClientProps {
  posts: any[];
}

export function PostsTableClient({ posts }: PostsTableClientProps) {
  const router = useRouter();

  const handleDelete = async (id: string) => {
    await fetch(`/api/posts?id=${id}`, { method: "DELETE" });
    router.refresh();
  };

  return <PostsTable posts={posts} onDelete={handleDelete} />;
}