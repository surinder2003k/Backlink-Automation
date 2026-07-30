"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PostsTable } from "@/components/dashboard/posts-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import { Plus, Loader2 } from "lucide-react";

interface Post {
  id: string;
  title: string;
  url: string;
  platforms: string[];
  status: string;
  platform_results: any;
  created_at: string;
  scheduled_at: string | null;
  published_at: string | null;
}

const PLATFORMS = ["devto", "blogger", "tumblr"];

interface PostsClientProps {
  posts: Post[];
}

export function PostsClient({ posts }: PostsClientProps) {
  const router = useRouter();
  const [showNew, setShowNew] = useState(false);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [scheduleAt, setScheduleAt] = useState("");
  const [saving, setSaving] = useState(false);

  const triggerPost = async (id: string, platforms: string[]) => {
    const res = await fetch("/api/post-now", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId: id }),
    });
    if (res.ok) router.refresh();
  };

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/posts?id=${id}`, { method: "DELETE" });
    if (res.ok) router.refresh();
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, url, excerpt, platforms: selectedPlatforms, scheduled_at: scheduleAt || null }),
    });
    if (res.ok) {
      const data = await res.json();
      setShowNew(false);
      setTitle(""); setUrl(""); setExcerpt(""); setSelectedPlatforms([]); setScheduleAt("");
      if (!scheduleAt) {
        setSaving(false);
        await triggerPost(data.id, selectedPlatforms);
        return;
      }
      router.refresh();
    }
    setSaving(false);
  };

  const togglePlatform = (p: string) => {
    setSelectedPlatforms((prev) => prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-heading font-bold text-cyber-text">Posts</h2>
          <p className="text-sm text-cyber-text-muted mt-1">Manage your backlink posts</p>
        </div>
        <Button onClick={() => setShowNew(true)}>
          <Plus className="h-4 w-4 mr-2" /> New Post
        </Button>
      </div>

      <PostsTable
        posts={posts}
        onDelete={handleDelete}
      />

      <Dialog open={showNew} onOpenChange={setShowNew}>
        <DialogContent onPointerDownOutside={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle>New Post</DialogTitle>
            <DialogDescription>Create a new backlink post to publish across platforms</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-mono text-cyber-text-muted">Title</label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Blog post title" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-mono text-cyber-text-muted">URL</label>
              <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://yourblog.com/post" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-mono text-cyber-text-muted">Excerpt (optional)</label>
              <Input value={excerpt} onChange={(e) => setExcerpt(e.target.value)} placeholder="Short description" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-mono text-cyber-text-muted">Platforms</label>
              <div className="flex flex-wrap gap-2">
                {PLATFORMS.map((p) => (
                  <Button key={p} type="button" variant={selectedPlatforms.includes(p) ? "default" : "secondary"} size="sm"
                    onClick={() => togglePlatform(p)} className={selectedPlatforms.includes(p) ? "bg-cyber-cyan text-black" : ""}>
                    {p}
                  </Button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-mono text-cyber-text-muted">Schedule (optional)</label>
              <DateTimePicker
                value={scheduleAt}
                onChange={setScheduleAt}
                min={new Date().toISOString().slice(0, 16)}
              />
              <p className="text-[10px] text-cyber-text-muted">Leave empty to post immediately</p>
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="secondary" onClick={() => setShowNew(false)}>Cancel</Button>
              <Button type="submit" disabled={saving}>
                {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null} {scheduleAt ? "Schedule" : "Post Now"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
