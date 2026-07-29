"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { ScrollText } from "lucide-react";

interface Activity {
  id: string;
  title: string;
  platforms: string[];
  status: string;
  created_at: string;
}

interface ActivityLogProps {
  activities: Activity[];
}

export function ActivityLog({ activities }: ActivityLogProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <ScrollText className="h-4 w-4 text-cyber-cyan" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <p className="text-sm text-cyber-text-muted text-center py-8">
            No recent activity
          </p>
        ) : (
          <div className="space-y-3">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between rounded-md border border-cyber-border bg-cyber-bg/50 px-4 py-3"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-cyber-text truncate">
                    {activity.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-mono text-[10px] text-cyber-text-muted">
                      {formatDate(activity.created_at)}
                    </span>
                    <span className="text-cyber-text-muted">·</span>
                    <span className="font-mono text-[10px] text-cyber-text-muted">
                      {activity.platforms.join(", ")}
                    </span>
                  </div>
                </div>
                <Badge
                  variant={
                    activity.status === "published"
                      ? "published"
                      : activity.status === "failed"
                      ? "failed"
                      : "pending"
                  }
                >
                  {activity.status}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
