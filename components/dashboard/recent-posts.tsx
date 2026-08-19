"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { ExternalLink, Zap, CheckCircle, XCircle, Clock } from "lucide-react";

interface Post {
  id: string;
  title: string;
  url: string;
  platforms: string[];
  status: string;
  platform_results: any;
  created_at: string;
  source_type: string;
}

interface RecentPostsProps {
  posts: Post[];
}

export function RecentPosts({ posts }: RecentPostsProps) {
  if (posts.length === 0) {
    return (
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <span className="text-cyber-cyan">▸</span>
            Recent Posts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-cyber-text-muted text-center py-8">
            No posts yet. Create your first post or enable automation!
          </p>
        </CardContent>
      </Card>
    );
  }

  const platformColors: Record<string, string> = {
    devto: "text-purple-400",
    blogger: "text-yellow-400",
    tumblr: "text-blue-300",
  };

  const statusIcons: Record<string, any> = {
    published: CheckCircle,
    pending: Clock,
    failed: XCircle,
  };

  const statusColors: Record<string, string> = {
    published: "text-green-400",
    pending: "text-cyber-orange",
    failed: "text-cyber-red",
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <span className="text-cyber-cyan">▸</span>
          Recent Posts
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {posts.map((post, index) => {
          const StatusIcon = statusIcons[post.status] || Clock;
          const isAutomated = post.source_type === "automated";
          
          return (
            <div
              key={post.id}
              className="flex items-start gap-3 p-3 rounded-lg border border-cyber-border/50 hover:bg-cyber-card-hover/50 transition-all group animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${
                isAutomated ? "bg-cyber-orange/20 text-cyber-orange" : "bg-cyber-cyan/20 text-cyber-cyan"
              }`}>
                {isAutomated ? <Zap className="h-5 w-5" /> : <StatusIcon className="h-5 w-5" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-medium text-cyber-text truncate pr-2">{post.title}</h4>
                  {isAutomated && (
                    <span className="flex-shrink-0 px-1.5 py-0.5 text-[10px] font-mono bg-cyber-orange/20 text-cyber-orange rounded">
                      AUTO
                    </span>
                  )}
                  <Badge
                    variant={
                      post.status === "published" ? "published" :
                      post.status === "failed" ? "failed" : "pending"
                    }
                    className="flex-shrink-0"
                  >
                    {post.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-3 mt-1 text-xs">
                  <a
                    href={post.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-cyber-text-muted hover:text-cyber-cyan truncate max-w-[200px]"
                  >
                    <ExternalLink className="h-3 w-3 shrink-0" />
                    {post.url.replace(/^https?:\/\//, "").slice(0, 35)}
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
          );
        })}
      </CardContent>
    </Card>
  );
}