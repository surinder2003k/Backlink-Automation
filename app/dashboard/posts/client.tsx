"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PostsTable } from "@/components/dashboard/posts-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
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
const PLATFORM_TIMES: Record<string, number> = { devto: 3000, blogger: 4000, tumblr: 3000 };

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
  const [saving, setSaving] = useState(false);
  const [postingId, setPostingId] = useState<string | null>(null);
  const [postProgress, setPostProgress] = useState({ current: 0, total: 0, platform: "", eta: 0, results: [] as any[] });

  const handlePostNow = async (id: string) => {
    const post = posts.find((p) => p.id === id);
    if (!post) return;
    const platforms = post.platforms;
    const totalTime = platforms.reduce((sum, p) => sum + (PLATFORM_TIMES[p] || 3000), 0);

    setPostingId(id);
    setPostProgress({ current: 0, total: platforms.length, platform: "", eta: Math.ceil(totalTime / 1000), results: [] });

    let elapsed = 0;
    for (let i = 0; i < platforms.length; i++) {
      const p = platforms[i];
      const pTime = PLATFORM_TIMES[p] || 3000;
      setPostProgress((prev) => ({
        ...prev,
        current: i,
        platform: p,
        eta: Math.ceil((totalTime - elapsed) / 1000),
      }));
      await new Promise((r) => setTimeout(r, pTime));
      elapsed += pTime;
    }

    setPostProgress((prev) => ({ ...prev, current: platforms.length, platform: "Done!", eta: 0 }));

    const res = await fetch("/api/post-now", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId: id }),
    });
    if (res.ok) {
      const data = await res.json();
      setPostProgress((prev) => ({
        ...prev,
        results: Object.entries(data.results || {}).map(([k, v]: [string, any]) => ({
          platform: k,
          success: v.success,
          url: v.url || v.id || null,
          error: v.error || null,
        })),
      }));
      router.refresh();
    }
    setTimeout(() => { setPostingId(null); setPostProgress({ current: 0, total: 0, platform: "", eta: 0, results: [] }); }, 3000);
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
      body: JSON.stringify({ title, url, excerpt, platforms: selectedPlatforms }),
    });
    if (res.ok) {
      setShowNew(false);
      setTitle(""); setUrl(""); setExcerpt(""); setSelectedPlatforms([]);
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

      {postingId && postProgress.total > 0 && (
        <Card className="border-cyber-cyan/30 bg-cyber-cyan/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-cyber-cyan" />
                <span className="text-sm font-mono text-cyber-text">
                  Posting to <span className="text-cyber-cyan">{postProgress.platform}</span>...
                </span>
              </div>
              <span className="text-xs font-mono text-cyber-text-muted">
                {postProgress.current}/{postProgress.total} platforms
                {postProgress.eta > 0 && ` ~${postProgress.eta}s left`}
              </span>
            </div>
            <div className="w-full bg-cyber-border rounded-full h-2">
              <div
                className="bg-cyber-cyan h-2 rounded-full transition-all duration-500"
                style={{ width: `${(postProgress.current / postProgress.total) * 100}%` }}
              />
            </div>
            {postProgress.results.length > 0 && (
              <div className="mt-3 space-y-1">
                {postProgress.results.map((r) => (
                  <div key={r.platform} className="flex items-center gap-2 text-xs">
                    <span className={r.success ? "text-green-400" : "text-cyber-red"}>
                      {r.success ? "✓" : "✗"}
                    </span>
                    <span className="font-mono text-cyber-text-muted">{r.platform}</span>
                    {r.url && (
                      <a href={r.url} target="_blank" rel="noopener noreferrer" className="text-cyber-cyan hover:underline">
                        View Post ↗
                      </a>
                    )}
                    {r.error && <span className="text-cyber-red">{r.error}</span>}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <PostsTable
        posts={posts}
        onPostNow={handlePostNow}
        onDelete={handleDelete}
        postingId={postingId}
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
            <div className="flex justify-end gap-2">
              <Button type="button" variant="secondary" onClick={() => setShowNew(false)}>Cancel</Button>
              <Button type="submit" disabled={saving}>
                {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null} Create
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
