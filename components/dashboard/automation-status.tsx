"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { Zap, RotateCcw, Clock, CheckCircle, AlertCircle, Globe, Database, TrendingUp } from "lucide-react";

interface AutomationConfig {
  is_enabled?: boolean;
  interval_hours?: number;
  max_posts_per_run?: number;
  platforms?: string[];
  sitemap_urls?: string[];
  current_sitemap_index?: number;
  last_run_at?: string;
  next_run_at?: string;
}

interface AutomationStatusProps {
  automation: AutomationConfig | null;
}

const sitemapNames = ["XylosAI", "Pathseekers", "Surinder Web Dev"];
const sitemapColors = ["text-cyber-cyan", "text-cyber-orange", "text-purple-400"];

export function AutomationStatus({ automation }: AutomationStatusProps) {
  const config = automation || {};
  const isEnabled = config.is_enabled;
  const currentIndex = config.current_sitemap_index || 0;
  const sitemapUrls = config.sitemap_urls || [
    "https://xylosai.vercel.app/sitemap.xml",
    "https://pathseekers.vercel.app/sitemap.xml",
    "https://surinder-web-dev.vercel.app/sitemap.xml",
  ];

  const nextSitemapIndex = (currentIndex + 1) % sitemapUrls.length;

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Zap className="h-4 w-4 text-cyber-orange" />
          Automation Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status badge */}
        <div className="flex items-center gap-3 p-3 rounded-lg bg-cyber-card border border-cyber-border/50">
          <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${
            isEnabled ? "bg-green-500/20 text-green-400" : "bg-cyber-red/20 text-cyber-red"
          }`}>
            {isEnabled ? <CheckCircle className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
          </div>
          <div>
            <p className="font-medium text-cyber-text">
              {isEnabled ? "Automation Active" : "Automation Paused"}
            </p>
            <p className="text-sm text-cyber-text-muted font-mono">
              {isEnabled ? `Runs every ${config.interval_hours || 6} hours` : "Click to enable in Settings"}
            </p>
          </div>
        </div>

        {/* Next run countdown */}
        {config.next_run_at && (
          <div className="flex items-center gap-3 p-3 rounded-lg bg-cyber-card border border-cyber-border/50">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyber-cyan/20 text-cyber-cyan">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <p className="font-mono text-[10px] text-cyber-text-muted uppercase tracking-wider">Next Run</p>
              <p className="text-sm text-cyber-text">{formatDate(config.next_run_at)}</p>
            </div>
            <div className="ml-auto text-right">
              <p className="font-mono text-[10px] text-cyber-text-muted uppercase tracking-wider">Posts/Run</p>
              <p className="text-sm font-bold text-cyber-text">{config.max_posts_per_run || 3}</p>
            </div>
          </div>
        )}

        {/* Last run */}
        {config.last_run_at && (
          <div className="flex items-center gap-3 p-3 rounded-lg bg-cyber-card border border-cyber-border/50">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/20 text-green-400">
              <CheckCircle className="h-5 w-5" />
            </div>
            <div>
              <p className="font-mono text-[10px] text-cyber-text-muted uppercase tracking-wider">Last Run</p>
              <p className="text-sm text-cyber-text">{formatDate(config.last_run_at)}</p>
            </div>
            <div className="ml-auto text-right">
              <p className="font-mono text-[10px] text-cyber-text-muted uppercase tracking-wider">Platforms</p>
              <p className="text-sm text-cyber-text">
                {(config.platforms || ["devto", "blogger", "tumblr"]).length}
              </p>
            </div>
          </div>
        )}

        {/* Sitemap Rotation */}
        <div className="space-y-3 pt-2 border-t border-cyber-border/50">
          <div className="flex items-center justify-between">
            <p className="font-mono text-[10px] text-cyber-text-muted uppercase tracking-wider">
              Sitemap Rotation
            </p>
            <Badge variant={isEnabled ? "published" : "pending"} className="text-xs">
              {isEnabled ? "Rotating" : "Paused"}
            </Badge>
          </div>
          
          <div className="space-y-2">
            {sitemapUrls.map((url, index) => {
              const isCurrent = index === currentIndex;
              const isNext = index === nextSitemapIndex;
              
              return (
                <div
                  key={index}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                    isCurrent
                      ? "bg-cyber-cyan/10 border border-cyber-cyan/30 neon-cyan"
                      : isNext
                      ? "bg-cyber-orange/10 border border-cyber-orange/30"
                      : "bg-cyber-card border border-cyber-border/50"
                  }`}
                >
                  <div className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold font-mono ${
                    isCurrent ? "bg-cyber-cyan text-black" : isNext ? "bg-cyber-orange/20 text-cyber-orange" : "bg-cyber-border text-cyber-text-muted"
                  }`}>
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-medium truncate ${sitemapColors[index]}`}>{sitemapNames[index]}</p>
                    <p className="text-xs text-cyber-text-muted truncate font-mono">{url}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {isCurrent && (
                      <span className="flex items-center gap-1 text-xs text-cyber-cyan">
                        <Globe className="h-3 w-3 animate-pulse" />
                        Current
                      </span>
                    )}
                    {isNext && (
                      <span className="flex items-center gap-1 text-xs text-cyber-orange">
                        <RotateCcw className="h-3 w-3" />
                        Next
                      </span>
                    )}
                    {!isCurrent && !isNext && (
                      <span className="flex items-center gap-1 text-xs text-cyber-text-muted">
                        <Database className="h-3 w-3" />
                        Queued
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Progress bar visualization */}
          <div className="pt-2">
            <div className="flex items-center gap-2 text-xs text-cyber-text-muted mb-1">
              <span>Rotation Progress</span>
              <span className="font-mono text-cyber-cyan">
                {currentIndex + 1} / {sitemapUrls.length}
              </span>
            </div>
            <div className="h-2 bg-cyber-border rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyber-cyan via-cyber-orange to-cyber-red rounded-full transition-all duration-500"
                style={{ width: `${((currentIndex + 1) / sitemapUrls.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-3 pt-2 border-t border-cyber-border/50">
          <div className="text-center p-2 rounded bg-cyber-card border border-cyber-border/50">
            <p className="text-2xl font-heading font-bold text-cyber-cyan">{config.platforms?.length || 3}</p>
            <p className="font-mono text-[10px] text-cyber-text-muted">Platforms</p>
          </div>
          <div className="text-center p-2 rounded bg-cyber-card border border-cyber-border/50">
            <p className="text-2xl font-heading font-bold text-cyber-orange">{config.interval_hours || 6}h</p>
            <p className="font-mono text-[10px] text-cyber-text-muted">Interval</p>
          </div>
          <div className="text-center p-2 rounded bg-cyber-card border border-cyber-border/50">
            <p className="text-2xl font-heading font-bold text-green-400">{config.max_posts_per_run || 3}</p>
            <p className="font-mono text-[10px] text-cyber-text-muted">Max/Run</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}