"use client";

import { StatsCards } from "@/components/dashboard/stats-cards";
import { RecentPosts } from "@/components/dashboard/recent-posts";
import { AutomationStatus } from "@/components/dashboard/automation-status";

interface DashboardClientProps {
  totalPosts: number;
  scheduled: number;
  published: number;
  failed: number;
  successRate: number;
  automatedPosts: number;
  usedUrlsCount: number;
  automation: any;
  recentPosts: any[];
}

export function DashboardClient({
  totalPosts,
  scheduled,
  published,
  failed,
  successRate,
  automatedPosts,
  usedUrlsCount,
  automation,
  recentPosts,
}: DashboardClientProps) {
  return (
    <div className="space-y-6 animate-fade-in-up">
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
        published={published}
        failed={failed}
        successRate={successRate}
        automatedPosts={automatedPosts}
        usedUrlsCount={usedUrlsCount}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <AutomationStatus automation={automation} />
        <RecentPosts posts={recentPosts} />
      </div>
    </div>
  );
}