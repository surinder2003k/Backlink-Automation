"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Save, Loader2, ToggleLeft, ToggleRight, Play, RotateCcw, AlertTriangle } from "lucide-react";

interface SettingsData {
  devto_api_key?: string;
  blogger_client_id?: string;
  blogger_client_secret?: string;
  blogger_refresh_token?: string;
  blogger_blog_id?: string;
  tumblr_consumer_key?: string;
  tumblr_consumer_secret?: string;
  blog_url?: string;
}

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

interface SettingsClientProps {
  settings: SettingsData;
  automation: AutomationConfig;
}

export function SettingsClient({ settings, automation }: SettingsClientProps) {
  const router = useRouter();
  const [form, setForm] = useState<SettingsData>(settings);
  const [autoForm, setAutoForm] = useState<AutomationConfig>(automation);
  const [saving, setSaving] = useState(false);
  const [autoSaving, setAutoSaving] = useState(false);
  const [triggering, setTriggering] = useState(false);
  const [triggerResult, setTriggerResult] = useState<string | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    router.refresh();
  };

  const handleAutoSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setAutoSaving(true);
    await fetch("/api/automation/config", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(autoForm),
    });
    setAutoSaving(false);
    router.refresh();
  };

  const handleTrigger = async () => {
    setTriggering(true);
    setTriggerResult(null);
    const res = await fetch("/api/automation/config", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "trigger" }),
    });
    const data = await res.json();
    setTriggerResult(JSON.stringify(data, null, 2));
    setTriggering(false);
    router.refresh();
  };

  const handleResetUsedUrls = async () => {
    if (!confirm("This will reset all used URLs. Are you sure?")) return;
    const res = await fetch("/api/automation/config", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "reset_used_urls" }),
    });
    const data = await res.json();
    setTriggerResult(JSON.stringify(data, null, 2));
    router.refresh();
  };

  const handleResetRotation = async () => {
    const res = await fetch("/api/automation/config", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "reset_rotation" }),
    });
    const data = await res.json();
    setTriggerResult(JSON.stringify(data, null, 2));
    router.refresh();
  };

  const updateField = (field: keyof SettingsData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const updateAutoField = (field: keyof AutomationConfig, value: any) => {
    setAutoForm((prev) => ({ ...prev, [field]: value }));
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "Never";
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(dateStr));
  };

  const sitemapNames = [
    "XylosAI",
    "Pathseekers",
    "Surinder Web Dev"
  ];

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-heading font-bold text-cyber-text">
          Settings
        </h2>
        <p className="text-sm text-cyber-text-muted mt-1">
          Configure API keys, account settings, and automation
        </p>
      </div>

      {/* Blog Configuration */}
      <form onSubmit={handleSave}>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-base">Blog Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-mono text-cyber-text-muted">
                Blog URL
              </label>
              <Input
                value={form.blog_url || ""}
                onChange={(e) => updateField("blog_url", e.target.value)}
                placeholder="https://yourblog.com"
              />
            </div>
          </CardContent>
        </Card>

        {/* Dev.to API */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-base">Dev.to API</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-mono text-cyber-text-muted">
                API Key
              </label>
              <Input
                type="password"
                value={form.devto_api_key || ""}
                onChange={(e) => updateField("devto_api_key", e.target.value)}
                placeholder="Enter key"
              />
            </div>
          </CardContent>
        </Card>

        {/* Blogger API */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-base">Blogger API</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-mono text-cyber-text-muted">
                  Client ID
                </label>
                <Input
                  value={form.blogger_client_id || ""}
                  onChange={(e) => updateField("blogger_client_id", e.target.value)}
                  placeholder="Enter ID"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-mono text-cyber-text-muted">
                  Client Secret
                </label>
                <Input
                  type="password"
                  value={form.blogger_client_secret || ""}
                  onChange={(e) => updateField("blogger_client_secret", e.target.value)}
                  placeholder="Enter secret"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-mono text-cyber-text-muted">
                  Refresh Token
                </label>
                <Input
                  type="password"
                  value={form.blogger_refresh_token || ""}
                  onChange={(e) => updateField("blogger_refresh_token", e.target.value)}
                  placeholder="Enter refresh token"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-mono text-cyber-text-muted">
                  Blog ID (optional)
                </label>
                <Input
                  value={form.blogger_blog_id || ""}
                  onChange={(e) => updateField("blogger_blog_id", e.target.value)}
                  placeholder="Auto-detected if empty"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tumblr API */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-base">Tumblr API</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-mono text-cyber-text-muted">
                  Consumer Key
                </label>
                <Input
                  value={form.tumblr_consumer_key || ""}
                  onChange={(e) => updateField("tumblr_consumer_key", e.target.value)}
                  placeholder="Enter key"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-mono text-cyber-text-muted">
                  Consumer Secret
                </label>
                <Input
                  type="password"
                  value={form.tumblr_consumer_secret || ""}
                  onChange={(e) => updateField("tumblr_consumer_secret", e.target.value)}
                  placeholder="Enter secret"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center gap-4">
          <Button type="submit" disabled={saving}>
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Save Settings
          </Button>
        </div>
      </form>

      {/* Automation Settings */}
      <div className="border-t border-cyber-border pt-8">
        <h3 className="text-xl font-heading font-bold text-cyber-text mb-4">Automation Settings</h3>
        <p className="text-sm text-cyber-text-muted mb-6">
          Configure automatic backlink generation from sitemaps. Runs every 6 hours, rotating through 3 sitemaps.
        </p>

        <form onSubmit={handleAutoSave}>
          <Card className="mb-6">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Automation Status</CardTitle>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoForm.is_enabled || false}
                  onChange={(e) => updateAutoField("is_enabled", e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-cyber-border peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyber-cyan/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-cyber-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyber-cyan"></div>
              </label>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className={`text-sm ${autoForm.is_enabled ? "text-green-400" : "text-cyber-text-muted"}`}>
                {autoForm.is_enabled ? "● Automation is ENABLED - runs every 6 hours" : "○ Automation is DISABLED"}
              </p>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-base">Schedule & Limits</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-mono text-cyber-text-muted">
                    Interval (hours)
                  </label>
                  <Input
                    type="number"
                    min="1"
                    max="24"
                    value={autoForm.interval_hours || 6}
                    onChange={(e) => updateAutoField("interval_hours", parseInt(e.target.value) || 6)}
                    placeholder="6"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-mono text-cyber-text-muted">
                    Max Posts Per Run
                  </label>
                  <Input
                    type="number"
                    min="1"
                    max="10"
                    value={autoForm.max_posts_per_run || 3}
                    onChange={(e) => updateAutoField("max_posts_per_run", parseInt(e.target.value) || 3)}
                    placeholder="3"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-base">Target Platforms</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4 flex-wrap">
                {["devto", "blogger", "tumblr"].map((platform) => (
                  <label key={platform} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={autoForm.platforms?.includes(platform) || false}
                      onChange={(e) => {
                        const platforms = autoForm.platforms || [];
                        if (e.target.checked) {
                          updateAutoField("platforms", [...platforms, platform]);
                        } else {
                          updateAutoField("platforms", platforms.filter((p) => p !== platform));
                        }
                      }}
                      className="w-4 h-4 text-cyber-cyan border-cyber-border rounded focus:ring-cyber-cyan"
                    />
                    <span className="text-sm text-cyber-text capitalize">{platform}</span>
                  </label>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-base">Sitemap Sources (Rotating)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-cyber-text-muted">
                              Current sitemap index: <span className="font-mono text-cyber-cyan">{autoForm.current_sitemap_index || 0}</span> - 
                              Next will use: <span className="font-mono text-cyber-orange">
                                {autoForm.sitemap_urls && autoForm.sitemap_urls.length > 0 
                                  ? sitemapNames[((autoForm.current_sitemap_index || 0) + 1) % autoForm.sitemap_urls.length] 
                                  : "XylosAI"}
                              </span>
                            </p>
                            <div className="space-y-2">
                              {autoForm.sitemap_urls?.map((url, index) => (
                                <div key={index} className="flex items-center gap-2 p-2 rounded border border-cyber-border/50">
                                  <span className={`font-mono text-xs px-2 py-1 rounded ${
                                    index === (autoForm.current_sitemap_index || 0)
                                      ? "bg-cyber-cyan/20 text-cyber-cyan" 
                                      : "bg-cyber-card text-cyber-text-muted"
                                  }`}>
                                    {index === (autoForm.current_sitemap_index || 0) ? "► " : ""}{sitemapNames[index]}
                                  </span>
                    <span className="text-xs text-cyber-text-muted truncate flex-1">{url}</span>
                    <input
                      type="checkbox"
                      checked={autoForm.platforms?.includes("devto") || false} // placeholder
                      className="w-4 h-4 text-cyber-cyan border-cyber-border rounded"
                      disabled
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-base">Automation Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2 p-3 rounded bg-cyber-card border border-cyber-border">
                  <p className="font-mono text-[10px] text-cyber-text-muted uppercase tracking-wider">Last Run</p>
                  <p className="text-sm text-cyber-text">{formatDate(autoForm.last_run_at)}</p>
                </div>
                <div className="space-y-2 p-3 rounded bg-cyber-card border border-cyber-border">
                  <p className="font-mono text-[10px] text-cyber-text-muted uppercase tracking-wider">Next Run</p>
                  <p className="text-sm text-cyber-text">{formatDate(autoForm.next_run_at)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center gap-4 mb-6">
            <Button type="submit" disabled={autoSaving}>
              {autoSaving ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Save Automation Settings
            </Button>
            
            <Button 
              variant="secondary" 
              onClick={handleTrigger}
              disabled={triggering || !autoForm.is_enabled}
              className="gap-2"
            >
              {triggering ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Play className="h-4 w-4" />
              )}
              Trigger Now
            </Button>

            <Button 
              variant="outline" 
              onClick={handleResetRotation}
              className="gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Reset Rotation
            </Button>

            <Button 
              variant="destructive" 
              onClick={handleResetUsedUrls}
              className="gap-2"
            >
              <AlertTriangle className="h-4 w-4" />
              Reset Used URLs
            </Button>
          </div>

          {triggerResult && (
            <div className="p-4 rounded bg-cyber-card border border-cyber-border">
              <p className="font-mono text-[10px] text-cyber-text-muted uppercase tracking-wider mb-2">Last Trigger Result</p>
              <pre className="text-xs text-cyber-text overflow-x-auto max-h-60">{triggerResult}</pre>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}