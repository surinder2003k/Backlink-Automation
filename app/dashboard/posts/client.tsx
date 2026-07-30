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
  const [postCount, setPostCount] = useState(1);
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

    let scheduledISO: string | null = null;
    if (scheduleAt) {
      const localDate = new Date(scheduleAt);
      scheduledISO = localDate.toISOString();
    }

    const count = Math.max(1, Math.min(10, postCount));

    for (let i = 0; i < count; i++) {
      const postTitle = count > 1 ? `${title} ${i + 1}` : title;
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: postTitle, url, excerpt, platforms: selectedPlatforms, scheduled_at: scheduledISO }),
      });

      if (res.ok && !scheduledISO) {
        const data = await res.json();
        await triggerPost(data.id, selectedPlatforms);
      }
    }

    setShowNew(false);
    setTitle(""); setUrl(""); setExcerpt(""); setSelectedPlatforms([]); setScheduleAt(""); setPostCount(1);
    setSaving(false);
    router.refresh();
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
        <DialogContent>
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
                min={(() => {
                  const now = new Date();
                  const y = now.getFullYear();
                  const m = String(now.getMonth() + 1).padStart(2, "0");
                  const d = String(now.getDate()).padStart(2, "0");
                  const h = String(now.getHours()).padStart(2, "0");
                  const min = String(now.getMinutes()).padStart(2, "0");
                  return `${y}-${m}-${d}T${h}:${min}`;
                })()}
              />
              <p className="text-[10px] text-cyber-text-muted">Leave empty to post immediately</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-mono text-cyber-text-muted">Number of Posts</label>
              <Input
                type="number"
                min={1}
                max={10}
                value={postCount}
                onChange={(e) => setPostCount(parseInt(e.target.value) || 1)}
                className="w-24"
              />
              <p className="text-[10px] text-cyber-text-muted">How many posts to create (1-10)</p>
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
