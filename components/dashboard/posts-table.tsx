"use client";

import { useState, useEffect } from "react";
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
  FileText,
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

interface PostsTableProps {
  posts: Post[];
  onPostNow: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  postingId?: string | null;
  postingPlatform?: string;
}

export function PostsTable({ posts, onPostNow, onDelete, postingId: externalPostingId, postingPlatform }: PostsTableProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [internalPostingId, setInternalPostingId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  const postingId = externalPostingId || internalPostingId;

  useEffect(() => {
    if (postingId) setSelectedPost(null);
  }, [postingId]);

  const filtered = posts.filter((post) => {
    const matchSearch =
      post.title.toLowerCase().includes(search.toLowerCase()) ||
      post.url.toLowerCase().includes(search.toLowerCase());
    const matchStatus =
      statusFilter === "all" || post.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handlePostNow = async (id: string) => {
    setInternalPostingId(id);
    await onPostNow(id);
    setInternalPostingId(null);
  };

  const platformColors: Record<string, string> = {
    devto: "text-purple-400",
    blogger: "text-yellow-400",
    tumblr: "text-blue-300",
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <FileText className="h-4 w-4 text-cyber-cyan" />
            Posts
          </CardTitle>
          <div className="flex gap-2 mt-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-cyber-text-muted" />
              <Input
                placeholder="Search posts..."
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
              No posts found
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-cyber-border">
                    <th className="text-left font-mono text-[10px] text-cyber-text-muted uppercase tracking-wider pb-3 pr-4">
                      Title
                    </th>
                    <th className="text-left font-mono text-[10px] text-cyber-text-muted uppercase tracking-wider pb-3 pr-4">
                      Platforms
                    </th>
                    <th className="text-left font-mono text-[10px] text-cyber-text-muted uppercase tracking-wider pb-3 pr-4">
                      Status
                    </th>
                    <th className="text-left font-mono text-[10px] text-cyber-text-muted uppercase tracking-wider pb-3 pr-4">
                      Date
                    </th>
                    <th className="text-right font-mono text-[10px] text-cyber-text-muted uppercase tracking-wider pb-3">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((post) => {
                    const isPosting = postingId === post.id;
                    return (
                      <tr
                        key={post.id}
                        onClick={() => !isPosting && setSelectedPost(post)}
                        className={`border-b border-cyber-border/50 transition-colors ${isPosting ? "bg-cyber-cyan/5" : "hover:bg-cyber-card-hover/50 cursor-pointer"}`}
                      >
                        <td className="py-3 pr-4">
                          <div className="min-w-0 max-w-[250px]">
                            <p className="text-sm text-cyber-text truncate">
                              {post.title}
                            </p>
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
                          {isPosting ? (
                            <div className="flex items-center gap-2">
                              <Loader2 className="h-3 w-3 animate-spin text-cyber-cyan" />
                              <span className="text-xs font-mono text-cyber-cyan">{postingPlatform || "posting..."}</span>
                            </div>
                          ) : (
                            <div className="flex gap-1.5 flex-wrap">
                              {post.platforms.map((p) => {
                                const result = post.platform_results?.[p];
                                const postUrl = result?.url;
                                return postUrl ? (
                                  <a
                                    key={p}
                                    href={postUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`font-mono text-[10px] uppercase ${platformColors[p] || "text-cyber-text-muted"} hover:underline`}
                                    title={postUrl}
                                  >
                                    {p} ↗
                                  </a>
                                ) : (
                                  <span
                                    key={p}
                                    className={`font-mono text-[10px] uppercase ${platformColors[p] || "text-cyber-text-muted"}`}
                                  >
                                    {p}
                                  </span>
                                );
                              })}
                            </div>
                          )}
                        </td>
                        <td className="py-3 pr-4">
                          {isPosting ? (
                            <div className="flex items-center gap-2">
                              <div className="w-16 bg-cyber-border rounded-full h-1.5">
                                <div className="bg-cyber-cyan h-1.5 rounded-full animate-pulse" style={{ width: "60%" }} />
                              </div>
                            </div>
                          ) : (
                            <Badge
                              variant={
                                post.status === "published"
                                  ? "published"
                                  : post.status === "failed"
                                  ? "failed"
                                  : "pending"
                              }
                            >
                              {post.status}
                            </Badge>
                          )}
                        </td>
                        <td className="py-3 pr-4">
                          <span className="font-mono text-xs text-cyber-text-muted">
                            {formatDate(post.created_at)}
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => { e.stopPropagation(); handlePostNow(post.id); }}
                              disabled={isPosting}
                              title="Post Now"
                              className="text-cyber-cyan hover:text-cyber-cyan"
                            >
                              {isPosting ? (
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

      <Dialog
        open={!!confirmDelete}
        onOpenChange={() => setConfirmDelete(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Post</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this post? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button
              variant="secondary"
              onClick={() => setConfirmDelete(null)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={async () => {
                if (confirmDelete) {
                  await onDelete(confirmDelete);
                  setConfirmDelete(null);
                }
              }}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!selectedPost}
        onOpenChange={() => setSelectedPost(null)}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedPost?.title}</DialogTitle>
            <DialogDescription>Post details and platform results</DialogDescription>
          </DialogHeader>
          {selectedPost && (
            <div className="space-y-4">
              <div>
                <p className="font-mono text-[10px] text-cyber-text-muted uppercase tracking-wider mb-1">Source URL</p>
                <a
                  href={selectedPost.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-cyber-cyan hover:underline break-all"
                >
                  {selectedPost.url}
                </a>
              </div>
              <div>
                <p className="font-mono text-[10px] text-cyber-text-muted uppercase tracking-wider mb-2">Platforms</p>
                <div className="space-y-2">
                  {selectedPost.platforms.map((p) => {
                    const result = selectedPost.platform_results?.[p];
                    const postUrl = result?.url;
                    return (
                      <div key={p} className="flex items-center justify-between rounded-md border border-cyber-border/50 px-3 py-2">
                        <span className={`font-mono text-xs uppercase ${platformColors[p] || "text-cyber-text-muted"}`}>
                          {p}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className={`font-mono text-[10px] ${result?.status === "success" ? "text-green-400" : result?.status === "failed" ? "text-cyber-red" : "text-cyber-text-muted"}`}>
                            {result?.status || "pending"}
                          </span>
                          {postUrl ? (
                            <a
                              href={postUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-cyber-cyan hover:underline"
                            >
                              <ExternalLink className="h-3.5 w-3.5" />
                            </a>
                          ) : null}
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
    </>
  );
}
