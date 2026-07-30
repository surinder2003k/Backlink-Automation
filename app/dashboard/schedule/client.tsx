"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatDate } from "@/lib/utils";
import {
  CalendarClock,
  Search,
  ExternalLink,
  Send,
  Trash2,
  Loader2,
} from "lucide-react";

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

interface ScheduleClientProps {
  posts: Post[];
}

const platformColors: Record<string, string> = {
  devto: "text-purple-400",
  blogger: "text-yellow-400",
  tumblr: "text-blue-300",
};

export function ScheduleClient({ posts }: ScheduleClientProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [postingId, setPostingId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  const scheduledPosts = posts.filter((p) => p.scheduled_at);

  const filtered = scheduledPosts.filter((post) => {
    const matchSearch =
      post.title.toLowerCase().includes(search.toLowerCase()) ||
      post.url.toLowerCase().includes(search.toLowerCase());
    const matchStatus =
      statusFilter === "all" || post.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const now = new Date();
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const overdue = posts.filter(
      (p) => p.status === "pending" && p.scheduled_at && new Date(p.scheduled_at) <= new Date()
    );
    if (overdue.length > 0 && !processing) {
      setProcessing(true);
      (async () => {
        for (const post of overdue) {
          try {
            await fetch("/api/post-now", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ postId: post.id }),
            });
          } catch (e) {
            console.error(`Failed to post ${post.id}`, e);
          }
        }
        router.refresh();
      })();
    }
  }, []);

  const handlePostNow = async (id: string) => {
    setPostingId(id);
    const res = await fetch("/api/post-now", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId: id }),
    });
    if (res.ok) window.location.reload();
    setTimeout(() => setPostingId(null), 2000);
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/posts?id=${id}`, { method: "DELETE" });
    window.location.reload();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-heading font-bold text-cyber-text">Schedule</h2>
        <p className="text-sm text-cyber-text-muted mt-1">
          Posts scheduled for future publishing ({scheduledPosts.length} total)
          {processing && <span className="ml-2 text-cyber-cyan animate-pulse">Processing overdue posts...</span>}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <CalendarClock className="h-4 w-4 text-cyber-cyan" />
            Scheduled Posts
          </CardTitle>
          <div className="flex gap-2 mt-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-cyber-text-muted" />
              <Input
                placeholder="Search scheduled posts..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {filtered.length === 0 ? (
            <p className="text-sm text-cyber-text-muted text-center py-8">
              {scheduledPosts.length === 0
                ? "No scheduled posts yet. Create a post and set a schedule time."
                : "No posts match your search"}
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-cyber-border">
                    <th className="text-left font-mono text-[10px] text-cyber-text-muted uppercase tracking-wider pb-3 pr-4">Title</th>
                    <th className="text-left font-mono text-[10px] text-cyber-text-muted uppercase tracking-wider pb-3 pr-4">Platforms</th>
                    <th className="text-left font-mono text-[10px] text-cyber-text-muted uppercase tracking-wider pb-3 pr-4">Status</th>
                    <th className="text-left font-mono text-[10px] text-cyber-text-muted uppercase tracking-wider pb-3 pr-4">Scheduled For</th>
                    <th className="text-right font-mono text-[10px] text-cyber-text-muted uppercase tracking-wider pb-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((post) => {
                    const schedDate = new Date(post.scheduled_at!);
                    const isPast = schedDate < now;
                    return (
                      <tr
                        key={post.id}
                        onClick={() => setSelectedPost(post)}
                        className="border-b border-cyber-border/50 hover:bg-cyber-card-hover/50 transition-colors cursor-pointer"
                      >
                        <td className="py-3 pr-4">
                          <div className="min-w-0 max-w-[250px]">
                            <p className="text-sm text-cyber-text truncate">{post.title}</p>
                            <a
                              href={post.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-xs text-cyber-text-muted hover:text-cyber-cyan mt-0.5"
                            >
                              <ExternalLink className="h-3 w-3" />
                              {post.url.replace(/^https?:\/\//, "").slice(0, 30)}
                            </a>
                          </div>
                        </td>
                        <td className="py-3 pr-4">
                          <div className="flex gap-1.5 flex-wrap">
                            {post.platforms.map((p) => (
                              <span key={p} className={`font-mono text-[10px] uppercase ${platformColors[p] || "text-cyber-text-muted"}`}>
                                {p}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="py-3 pr-4">
                          <Badge variant={post.status === "published" ? "published" : post.status === "failed" ? "failed" : "pending"}>
                            {post.status}
                          </Badge>
                        </td>
                        <td className="py-3 pr-4">
                          <div>
                            <span className={`font-mono text-xs ${isPast && post.status === "pending" ? "text-cyber-red" : "text-cyber-text-muted"}`}>
                              {formatDate(post.scheduled_at!)}
                            </span>
                            {isPast && post.status === "pending" && (
                              <p className="text-[10px] text-cyber-red">Overdue</p>
                            )}
                          </div>
                        </td>
                        <td className="py-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => { e.stopPropagation(); handlePostNow(post.id); }}
                              disabled={postingId === post.id}
                              title="Post Now"
                              className="text-cyber-cyan hover:text-cyber-cyan"
                            >
                              {postingId === post.id ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                <Send className="h-3.5 w-3.5" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => { e.stopPropagation(); setConfirmDelete(post.id); }}
                              title="Delete"
                              className="text-cyber-text-muted hover:text-cyber-red"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!confirmDelete} onOpenChange={() => setConfirmDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Scheduled Post</DialogTitle>
            <DialogDescription>Are you sure? This cannot be undone.</DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setConfirmDelete(null)}>Cancel</Button>
            <Button variant="destructive" onClick={() => { if (confirmDelete) { handleDelete(confirmDelete); setConfirmDelete(null); } }}>Delete</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!selectedPost} onOpenChange={() => setSelectedPost(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedPost?.title}</DialogTitle>
            <DialogDescription>Scheduled post details</DialogDescription>
          </DialogHeader>
          {selectedPost && (
            <div className="space-y-4">
              <div>
                <p className="font-mono text-[10px] text-cyber-text-muted uppercase tracking-wider mb-1">Source URL</p>
                <a href={selectedPost.url} target="_blank" rel="noopener noreferrer" className="text-sm text-cyber-cyan hover:underline break-all">
                  {selectedPost.url}
                </a>
              </div>
              <div>
                <p className="font-mono text-[10px] text-cyber-text-muted uppercase tracking-wider mb-1">Scheduled For</p>
                <p className="text-sm text-cyber-text">{formatDate(selectedPost.scheduled_at!)}</p>
              </div>
              <div>
                <p className="font-mono text-[10px] text-cyber-text-muted uppercase tracking-wider mb-2">Platforms</p>
                <div className="space-y-2">
                  {selectedPost.platforms.map((p) => {
                    const result = selectedPost.platform_results?.[p];
                    const postUrl = result?.url;
                    return (
                      <div key={p} className="flex items-center justify-between rounded-md border border-cyber-border/50 px-3 py-2">
                        <span className={`font-mono text-xs uppercase ${platformColors[p] || "text-cyber-text-muted"}`}>{p}</span>
                        <div className="flex items-center gap-2">
                          <span className={`font-mono text-[10px] ${result?.status === "success" ? "text-green-400" : result?.status === "failed" ? "text-cyber-red" : "text-cyber-text-muted"}`}>
                            {result?.status || "pending"}
                          </span>
                          {postUrl && (
                            <a href={postUrl} target="_blank" rel="noopener noreferrer" className="text-cyber-cyan hover:underline">
                              <ExternalLink className="h-3.5 w-3.5" />
                            </a>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
