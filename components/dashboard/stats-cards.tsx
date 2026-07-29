"use client";

import { Card, CardContent } from "@/components/ui/card";
import { FileText, CalendarClock, TrendingUp, Activity } from "lucide-react";

interface StatsCardsProps {
  totalPosts: number;
  scheduled: number;
  successRate: number;
  recentCount: number;
}

export function StatsCards({
  totalPosts,
  scheduled,
  successRate,
  recentCount,
}: StatsCardsProps) {
  const stats = [
    {
      label: "Total Posts",
      value: totalPosts,
      icon: FileText,
      color: "text-cyber-cyan",
      bg: "bg-cyber-cyan/10",
    },
    {
      label: "Scheduled",
      value: scheduled,
      icon: CalendarClock,
      color: "text-cyber-orange",
      bg: "bg-cyber-orange/10",
    },
    {
      label: "Success Rate",
      value: `${successRate}%`,
      icon: TrendingUp,
      color: "text-green-400",
      bg: "bg-green-500/10",
    },
    {
      label: "Recent Activity",
      value: recentCount,
      icon: Activity,
      color: "text-cyber-red",
      bg: "bg-cyber-red/10",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.label}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-mono text-cyber-text-muted">
                  {stat.label}
                </p>
                <p className="text-2xl font-heading font-bold text-cyber-text mt-1">
                  {stat.value}
                </p>
              </div>
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-lg ${stat.bg}`}
              >
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
