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
  Zap,
  ChevronDown,
  ChevronUp,
  CheckCircle,
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
  source_type: string;
}

interface PostsTableProps {
  posts: Post[];
  onDelete: (id: string) => Promise<void>;
}

export function PostsTable({ posts, onDelete }: PostsTableProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [page, setPage] = useState(1);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const PER_PAGE = 10;

  const filtered = posts.filter((post) => {
    const matchSearch =
      post.title.toLowerCase().includes(search.toLowerCase()) ||
      post.url.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || post.status === statusFilter;
    const matchSource = sourceFilter === "all" || post.source_type === sourceFilter;
    return matchSearch && matchStatus && matchSource;
  });

  const platformColors: Record<string, string> = {
    devto: "text-purple-400",
    blogger: "text-yellow-400",
    tumblr: "text-blue-300",
  };

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const resetPage = () => setPage(1);

  const toggleRow = (id: string) => {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <>
      <Card className="glass-card">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="flex items-center gap-2 text-base">
              <FileText className="h-4 w-4 text-cyber-cyan" />
              Posts
              <span className="font-mono text-[10px] text-cyber-text-muted">
                ({filtered.length}/{posts.length})
              </span>
            </CardTitle>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
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
                <SelectTrigger className="w-full sm:w-[140px]">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sourceFilter} onValueChange={(v) => { setSourceFilter(v); resetPage(); }}>
                <SelectTrigger className="w-full sm:w-[140px]">
                  <SelectValue placeholder="All Sources" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sources</SelectItem>
                  <SelectItem value="manual">Manual</SelectItem>
                  <SelectItem value="automated">Automated</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filtered.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-cyber-text-muted mx-auto mb-4 opacity-50" />
              <p className="text-sm text-cyber-text-muted">
                {posts.length === 0 ? "No posts yet. Create your first post!" : "No posts match your filters"}
              </p>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-cyber-border">
                      <th className="text-left font-mono text-[10px] text-cyber-text-muted uppercase tracking-wider pb-3 pr-4">
                        Title
                      </th>
                      <th className="text-left font-mono text-[10px] text-cyber-text-muted uppercase tracking-wider pb-3 pr-4">
                        Source
                      </th>
                      <th className="text-left font-mono text-[10px] text-cyber-text-muted uppercase tracking-wider pb-3 pr-4">
                        Status
                      </th>
                      <th className="text-left font-mono text-[10px] text-cyber-text-muted uppercase tracking-wider pb-3 pr-4">
                        Platforms
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
                    {paginated.map((post) => {
                      const isExpanded = expandedRows.has(post.id);
                      return (
                        <>
                          <tr
                            key={post.id}
                            onClick={() => toggleRow(post.id)}
                            className="border-b border-cyber-border/50 hover:bg-cyber-card-hover/50 transition-colors cursor-pointer"
                          >
                            <td className="py-3 pr-4">
                              <div className="min-w-0 max-w-[350px] flex items-center gap-2">
                                                              {post.source_type === "automated" && (
                                                                <Zap className="h-4 w-4 text-cyber-orange flex-shrink-0" aria-label="Automated" />
                                                              )}
                                <div className="min-w-0">
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
                              </div>
                            </td>
                            <td className="py-3 pr-4">
                              <Badge
                                                              variant={post.source_type === "automated" ? "published" : "default"}
                                                              className="text-xs font-mono"
                                                            >
                                {post.source_type === "automated" ? "AUTO" : "MANUAL"}
                              </Badge>
                            </td>
                            <td className="py-3 pr-4">
                              <Badge variant={post.status === "published" ? "published" : post.status === "failed" ? "failed" : "pending"}>
                                {post.status}
                              </Badge>
                            </td>
                            <td className="py-3 pr-4">
                              <div className="flex gap-1.5 flex-wrap">
                                {post.platforms.map((p) => (
                                  <span key={p} className={`font-mono text-[10px] uppercase px-2 py-0.5 rounded border ${platformColors[p] || "text-cyber-text-muted"} border-current/20`}>
                                    {p}
                                  </span>
                                ))}
                              </div>
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
                                  onClick={(e) => { e.stopPropagation(); setConfirmDelete(post.id); }}
                                  title="Delete"
                                  className="text-cyber-text-muted hover:text-cyber-red"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                                <button
                                  onClick={(e) => { e.stopPropagation(); toggleRow(post.id); }}
                                  className="p-1 text-cyber-text-muted hover:text-cyber-cyan transition-colors"
                                  aria-label={isExpanded ? "Collapse" : "Expand"}
                                >
                                  {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                </button>
                              </div>
                            </td>
                          </tr>
                          {/* Expanded row - platform results */}
                          {isExpanded && (
                            <tr className="bg-cyber-card/50">
                              <td colSpan={6} className="py-3">
                                <div className="ml-12 mt-2 space-y-2 border-l-2 border-cyber-border/50 pl-4">
                                  {post.platforms.map((p) => {
                                    const result = post.platform_results?.[p];
                                    const postUrl = result?.url;
                                    const isOk = result?.success === true;
                                    const isFailed = result?.success === false && result?.error;
                                    const verified = result?.verified === true;
                                    
                                    return (
                                      <div key={p} className="rounded-md border border-cyber-border/50 px-3 py-2">
                                        <div className="flex items-center justify-between mb-1">
                                          <span className={`font-mono text-xs uppercase font-bold ${platformColors[p] || "text-cyber-text-muted"}`}>
                                            {p}
                                          </span>
                                          <div className="flex items-center gap-2">
                                            <span className={`font-mono text-[10px] ${isOk ? (verified ? "text-green-400" : "text-cyber-orange") : isFailed ? "text-cyber-red" : "text-cyber-text-muted"}`}>
                                              {isOk ? (verified ? "Verified" : "Posted") : isFailed ? "Failed" : "Pending"}
                                            </span>
                                            {isOk && verified && (
                                              <span className="flex items-center gap-1 text-[10px] text-green-400">
                                                <CheckCircle className="h-3 w-3" />
                                                Verified
                                              </span>
                                            )}
                                          </div>
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
                              </td>
                            </tr>
                          )}
                        </>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="lg:hidden space-y-3">
                {paginated.map((post) => (
                  <div
                    key={post.id}
                    className="glass-card p-4"
                    onClick={() => setSelectedPost(post)}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${
                        post.source_type === "automated" ? "bg-cyber-orange/20 text-cyber-orange" : "bg-cyber-cyan/20 text-cyber-cyan"
                      }`}>
                        {post.source_type === "automated" ? <Zap className="h-5 w-5" /> : <FileText className="h-5 w-5" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-medium text-cyber-text truncate pr-2">{post.title}</h4>
                          {post.source_type === "automated" && (
                            <Badge variant="published" className="text-[10px]">AUTO</Badge>
                          )}
                          <Badge
                            variant={post.status === "published" ? "published" : post.status === "failed" ? "failed" : "pending"}
                            className="flex-shrink-0"
                          >
                            {post.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-xs">
                          <a
                            href={post.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-cyber-text-muted hover:text-cyber-cyan truncate"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <ExternalLink className="h-3 w-3 shrink-0" />
                            {post.url.replace(/^https?:\/\//, "").slice(0, 30)}
                          </a>
                          <span className="text-cyber-text-muted font-mono">{formatDate(post.created_at)}</span>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {post.platforms.map((p) => (
                            <span key={p} className={`font-mono text-[10px] uppercase px-2 py-0.5 rounded border ${platformColors[p] || "text-cyber-text-muted"} border-current/20`}>
                              {p}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
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

      {/* Delete Confirmation Dialog */}
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

      {/* Post Details Dialog */}
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
                <p className="font-mono text-[10px] text-cyber-text-muted uppercase tracking-wider mb-1">Source Type</p>
                <Badge variant={selectedPost.source_type === "automated" ? "published" : "default"}>
                  {selectedPost.source_type.toUpperCase()}
                </Badge>
              </div>
              <div>
                <p className="font-mono text-[10px] text-cyber-text-muted uppercase tracking-wider mb-2">Platforms & Blog Links</p>
                <div className="space-y-3">
                  {selectedPost.platforms.map((p) => {
                    const result = selectedPost.platform_results?.[p];
                    const postUrl = result?.url;
                    const isOk = result?.success === true;
                    const isFailed = result?.success === false && result?.error;
                    const verified = result?.verified === true;
                    return (
                      <div key={p} className="rounded-md border border-cyber-border/50 px-3 py-2">
                        <div className="flex items_center justify-between mb-1">
                          <span className={`font-mono text-xs uppercase font-bold ${platformColors[p] || "text-cyber-text-muted"}`}>
                            {p}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className={`font-mono text-[10px] ${isOk ? (verified ? "text-green-400" : "text-cyber-orange") : isFailed ? "text-cyber-red" : "text-cyber-text-muted"}`}>
                              {isOk ? (verified ? "Verified" : "Posted") : isFailed ? "Failed" : "Pending"}
                            </span>
                            {isOk && verified && (
                              <span className="flex items-center gap-1 text-[10px] text-green-400">
                                <CheckCircle className="h-3 w-3" />
                                Verified
                              </span>
                            )}
                          </div>
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