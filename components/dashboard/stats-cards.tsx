"use client";

import { Card, CardContent } from "@/components/ui/card";
import { FileText, CalendarClock, TrendingUp, Activity, Zap, Link as LinkIcon } from "lucide-react";

interface StatsCardsProps {
  totalPosts: number;
  scheduled: number;
  published: number;
  failed: number;
  successRate: number;
  automatedPosts: number;
  usedUrlsCount: number;
}

export function StatsCards({
  totalPosts,
  scheduled,
  published,
  failed,
  successRate,
  automatedPosts,
  usedUrlsCount,
}: StatsCardsProps) {
  const stats = [
    {
      label: "Total Posts",
      value: totalPosts,
      icon: FileText,
      color: "text-cyber-cyan",
      bg: "bg-cyber-cyan/10",
      trend: "+12%",
      trendColor: "text-green-400",
    },
    {
      label: "Published",
      value: published,
      icon: Activity,
      color: "text-green-400",
      bg: "bg-green-500/10",
      trend: `${successRate}% success`,
      trendColor: "text-green-400",
    },
    {
      label: "Automated",
      value: automatedPosts,
      icon: Zap,
      color: "text-cyber-orange",
      bg: "bg-cyber-orange/10",
      trend: "6h cycle",
      trendColor: "text-cyber-orange",
    },
    {
      label: "URLs Used",
      value: usedUrlsCount,
      icon: LinkIcon,
      color: "text-cyber-red",
      bg: "bg-cyber-red/10",
      trend: "No repeats",
      trendColor: "text-cyber-red",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card key={stat.label} className="glass-card animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-mono text-cyber-text-muted">{stat.label}</p>
                <p className="text-3xl font-heading font-bold text-cyber-text mt-1">{stat.value}</p>
                <p className={`text-xs font-mono mt-1 ${stat.trendColor}`}>{stat.trend}</p>
              </div>
              <div className={`flex h-14 w-14 items-center justify-center rounded-xl ${stat.bg}`}>
                <stat.icon className={`h-7 w-7 ${stat.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}