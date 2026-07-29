"use client";

import { StatsCards } from "@/components/dashboard/stats-cards";

interface DashboardClientProps {
  totalPosts: number;
  scheduled: number;
  successRate: number;
  recentCount: number;
}

export function DashboardClient({
  totalPosts,
  scheduled,
  successRate,
  recentCount,
}: DashboardClientProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-heading font-bold text-cyber-text">
          Dashboard
        </h2>
        <p className="text-sm text-cyber-text-muted mt-1">
          Overview of your backlink posting activity
        </p>
      </div>

      <StatsCards
        totalPosts={totalPosts}
        scheduled={scheduled}
        successRate={successRate}
        recentCount={recentCount}
      />
    </div>
  );
}
