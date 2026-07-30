"use client";

import { useState } from "react";
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
  Trash2,
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
  onDelete: (id: string) => Promise<void>;
}

export function PostsTable({ posts, onDelete }: PostsTableProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [page, setPage] = useState(1);
  const PER_PAGE = 10;

  const filtered = posts.filter((post) => {
    const matchSearch =
      post.title.toLowerCase().includes(search.toLowerCase()) ||
      post.url.toLowerCase().includes(search.toLowerCase());
    const matchStatus =
      statusFilter === "all" || post.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const platformColors: Record<string, string> = {
    devto: "text-purple-400",
    blogger: "text-yellow-400",
    tumblr: "text-blue-300",
  };

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const resetPage = () => setPage(1);

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
                onChange={(e) => { setSearch(e.target.value); resetPage(); }}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); resetPage(); }}>
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
                    <th className="text-left font-mono text-[10px] text-cyber-text-muted uppercase tracking-wider pb-3 pr-4">Title</th>
                    <th className="text-left font-mono text-[10px] text-cyber-text-muted uppercase tracking-wider pb-3 pr-4">Status</th>
                    <th className="text-left font-mono text-[10px] text-cyber-text-muted uppercase tracking-wider pb-3 pr-4">Date</th>
                    <th className="text-right font-mono text-[10px] text-cyber-text-muted uppercase tracking-wider pb-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((post) => (
                    <tr
                      key={post.id}
                      onClick={() => setSelectedPost(post)}
                      className="border-b border-cyber-border/50 transition-colors hover:bg-cyber-card-hover/50 cursor-pointer"
                    >
                      <td className="py-3 pr-4">
                        <div className="min-w-0 max-w-[350px]">
                          <p className="text-sm text-cyber-text truncate">{post.title}</p>
                          <a
                            href={post.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-xs text-cyber-text-muted hover:text-cyber-cyan mt-0.5"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <ExternalLink className="h-3 w-3" />
                            {post.url.replace(/^https?:\/\//, "").slice(0, 40)}
                          </a>
                        </div>
                      </td>
                      <td className="py-3 pr-4">
                        <Badge variant={post.status === "published" ? "published" : post.status === "failed" ? "failed" : "pending"}>
                          {post.status}
                        </Badge>
                      </td>
                      <td className="py-3 pr-4">
                        <span className="font-mono text-xs text-cyber-text-muted">
                          {formatDate(post.created_at)}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => { e.stopPropagation(); setConfirmDelete(post.id); }}
                          title="Delete"
                          className="text-cyber-text-muted hover:text-cyber-red"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-cyber-border">
              <p className="text-xs font-mono text-cyber-text-muted">
                Showing {(page - 1) * PER_PAGE + 1}-{Math.min(page * PER_PAGE, filtered.length)} of {filtered.length}
              </p>
              <div className="flex gap-1">
                <Button variant="secondary" size="sm" disabled={page === 1} onClick={() => setPage(page - 1)}>Prev</Button>
                <span className="flex items-center px-2 text-xs font-mono text-cyber-text-muted">{page}/{totalPages}</span>
                <Button variant="secondary" size="sm" disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!confirmDelete} onOpenChange={() => setConfirmDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Post</DialogTitle>
            <DialogDescription>Are you sure? This cannot be undone.</DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setConfirmDelete(null)}>Cancel</Button>
            <Button variant="destructive" onClick={async () => {
              if (confirmDelete) { await onDelete(confirmDelete); setConfirmDelete(null); }
            }}>Delete</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!selectedPost} onOpenChange={() => setSelectedPost(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedPost?.title}</DialogTitle>
            <DialogDescription>Published blogs on each platform</DialogDescription>
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
                <p className="font-mono text-[10px] text-cyber-text-muted uppercase tracking-wider mb-2">Platforms & Blog Links</p>
                <div className="space-y-3">
                  {selectedPost.platforms.map((p) => {
                    const result = selectedPost.platform_results?.[p];
                    const postUrl = result?.url;
                    const isOk = result?.success === true;
                    const isFailed = result?.success === false && result?.error;
                    return (
                      <div key={p} className="rounded-md border border-cyber-border/50 px-3 py-2">
                        <div className="flex items-center justify-between mb-1">
                          <span className={`font-mono text-xs uppercase font-bold ${platformColors[p] || "text-cyber-text-muted"}`}>
                            {p}
                          </span>
                          <span className={`font-mono text-[10px] ${isOk ? "text-green-400" : isFailed ? "text-cyber-red" : "text-cyber-text-muted"}`}>
                            {isOk ? "published" : isFailed ? "failed" : "pending"}
                          </span>
                        </div>
                        {postUrl ? (
                          <a
                            href={postUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-xs text-cyber-cyan hover:underline break-all"
                          >
                            <ExternalLink className="h-3 w-3 shrink-0" />
                            {postUrl.length > 60 ? postUrl.slice(0, 60) + "..." : postUrl}
                          </a>
                        ) : isFailed ? (
                          <p className="text-[10px] text-cyber-red">{result?.error || "Failed to post"}</p>
                        ) : (
                          <p className="text-[10px] text-cyber-text-muted">Not posted yet</p>
                        )}
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
