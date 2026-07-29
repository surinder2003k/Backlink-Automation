"use client";

import { StatsCards } from "@/components/dashboard/stats-cards";
import { ActivityLog } from "@/components/dashboard/activity-log";

interface Activity {
  id: string;
  title: string;
  platforms: string[];
  status: string;
  created_at: string;
}

interface DashboardClientProps {
  totalPosts: number;
  scheduled: number;
  successRate: number;
  recentCount: number;
  activities: Activity[];
}

export function DashboardClient({
  totalPosts,
  scheduled,
  successRate,
  recentCount,
  activities,
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

      <ActivityLog activities={activities} />
    </div>
  );
}
