"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlugZap, Loader2 } from "lucide-react";
import { useState } from "react";

interface PlatformConfig {
  id: string;
  label: string;
  configured: boolean;
}

interface PlatformStatusProps {
  platforms: PlatformConfig[];
  onTest: (platformId: string) => Promise<boolean>;
}

export function PlatformStatus({ platforms, onTest }: PlatformStatusProps) {
  const [testingId, setTestingId] = useState<string | null>(null);

  const handleTest = async (id: string) => {
    setTestingId(id);
    await onTest(id);
    setTestingId(null);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <PlugZap className="h-4 w-4 text-cyber-cyan" />
          Platform Connections
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {platforms.map((platform) => (
            <div
              key={platform.id}
              className="flex items-center justify-between rounded-md border border-cyber-border bg-cyber-bg/50 px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <span className="text-sm text-cyber-text font-medium">
                  {platform.label}
                </span>
                <Badge
                  variant={platform.configured ? "success" : "outline"}
                >
                  {platform.configured ? "Configured" : "Not Set"}
                </Badge>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleTest(platform.id)}
                disabled={!platform.configured || testingId === platform.id}
                className="text-cyber-cyan hover:text-cyber-cyan"
              >
                {testingId === platform.id ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  "Test"
                )}
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
