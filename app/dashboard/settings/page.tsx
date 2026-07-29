import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PlugZap } from "lucide-react";

export const dynamic = "force-dynamic";

const PLATFORMS = [
  { id: "devto", label: "Dev.to", envKey: "DEVTO_API_KEY" },
  { id: "blogger", label: "Blogger", envKey: "BLOGGER_CLIENT_ID" },
  { id: "tumblr", label: "Tumblr", envKey: "TUMBLR_CONSUMER_KEY" },
];

export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-2xl font-heading font-bold text-cyber-text">Settings</h2>
        <p className="text-sm text-cyber-text-muted mt-1">
          Platform keys are configured in <code className="text-cyber-cyan">.env.local</code>
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <PlugZap className="h-4 w-4 text-cyber-cyan" />
            Platform Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {PLATFORMS.map((p) => {
              const configured = !!process.env[p.envKey];
              return (
                <div
                  key={p.id}
                  className="flex items-center justify-between rounded-md border border-cyber-border bg-cyber-bg/50 px-4 py-3"
                >
                  <span className="text-sm text-cyber-text font-medium">{p.label}</span>
                  <Badge variant={configured ? "success" : "outline"}>
                    {configured ? "Configured" : "Not Set"}
                  </Badge>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
