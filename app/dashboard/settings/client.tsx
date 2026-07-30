"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Save, Loader2 } from "lucide-react";

interface SettingsData {
  devto_api_key?: string;
  blogger_client_id?: string;
  blogger_client_secret?: string;
  blogger_refresh_token?: string;
  blogger_blog_id?: string;
  tumblr_consumer_key?: string;
  tumblr_consumer_secret?: string;
  tumblr_access_token?: string;
  tumblr_access_secret?: string;
  blog_url?: string;
}

interface SettingsClientProps {
  settings: SettingsData;
}

export function SettingsClient({ settings }: SettingsClientProps) {
  const router = useRouter();
  const [form, setForm] = useState<SettingsData>(settings);
  const [saving, setSaving] = useState(false);

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

  const updateField = (field: keyof SettingsData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-2xl font-heading font-bold text-cyber-text">
          Settings
        </h2>
        <p className="text-sm text-cyber-text-muted mt-1">
          Configure API keys and account settings
        </p>
      </div>

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
              <div className="space-y-2">
                <label className="text-sm font-mono text-cyber-text-muted">
                  Access Token
                </label>
                <Input
                  value={form.tumblr_access_token || ""}
                  onChange={(e) => updateField("tumblr_access_token", e.target.value)}
                  placeholder="Enter token"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-mono text-cyber-text-muted">
                  Access Secret
                </label>
                <Input
                  type="password"
                  value={form.tumblr_access_secret || ""}
                  onChange={(e) => updateField("tumblr_access_secret", e.target.value)}
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
    </div>
  );
}
