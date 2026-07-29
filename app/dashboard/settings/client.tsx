"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlatformStatus } from "@/components/dashboard/platform-status";
import { maskKey } from "@/lib/utils";
import { Save, Loader2 } from "lucide-react";

const PLATFORMS = [
  { id: "twitter", label: "Twitter" },
  { id: "linkedin", label: "LinkedIn" },
  { id: "reddit", label: "Reddit" },
  { id: "medium", label: "Medium" },
  { id: "devto", label: "Dev.to" },
  { id: "blogger", label: "Blogger" },
  { id: "tumblr", label: "Tumblr" },
];

interface SettingsData {
  twitter_api_key?: string;
  twitter_api_secret?: string;
  twitter_access_token?: string;
  twitter_access_secret?: string;
  linkedin_access_token?: string;
  reddit_client_id?: string;
  reddit_client_secret?: string;
  reddit_username?: string;
  medium_access_token?: string;
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

  const handleTest = async (platformId: string): Promise<boolean> => {
    const res = await fetch("/api/post-now", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ testPlatform: platformId }),
    });
    return res.ok;
  };

  const platformConfigs = PLATFORMS.map((p) => ({
    ...p,
    configured:
      p.id === "twitter"
        ? !!(form.twitter_api_key && form.twitter_api_secret)
        : p.id === "linkedin"
        ? !!form.linkedin_access_token
        : p.id === "reddit"
        ? !!(form.reddit_client_id && form.reddit_client_secret)
        : p.id === "medium"
        ? !!form.medium_access_token
        : p.id === "devto"
        ? !!form.devto_api_key
        : p.id === "blogger"
        ? !!(form.blogger_client_id && form.blogger_client_secret && form.blogger_refresh_token)
        : p.id === "tumblr"
        ? !!(form.tumblr_consumer_key && form.tumblr_consumer_secret && form.tumblr_access_token)
        : false,
  }));

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
            <CardTitle className="text-base">Twitter API</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-mono text-cyber-text-muted">
                  API Key
                </label>
                <Input
                  value={form.twitter_api_key || ""}
                  onChange={(e) => updateField("twitter_api_key", e.target.value)}
                  placeholder={maskKey(form.twitter_api_key || "") || "Enter key"}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-mono text-cyber-text-muted">
                  API Secret
                </label>
                <Input
                  type="password"
                  value={form.twitter_api_secret || ""}
                  onChange={(e) => updateField("twitter_api_secret", e.target.value)}
                  placeholder={maskKey(form.twitter_api_secret || "") || "Enter secret"}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-mono text-cyber-text-muted">
                  Access Token
                </label>
                <Input
                  value={form.twitter_access_token || ""}
                  onChange={(e) => updateField("twitter_access_token", e.target.value)}
                  placeholder={maskKey(form.twitter_access_token || "") || "Enter token"}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-mono text-cyber-text-muted">
                  Access Secret
                </label>
                <Input
                  type="password"
                  value={form.twitter_access_secret || ""}
                  onChange={(e) => updateField("twitter_access_secret", e.target.value)}
                  placeholder={maskKey(form.twitter_access_secret || "") || "Enter secret"}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-base">LinkedIn API</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-mono text-cyber-text-muted">
                Access Token
              </label>
              <Input
                type="password"
                value={form.linkedin_access_token || ""}
                onChange={(e) => updateField("linkedin_access_token", e.target.value)}
                placeholder={maskKey(form.linkedin_access_token || "") || "Enter token"}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-base">Reddit API</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <label className="text-sm font-mono text-cyber-text-muted">
                  Client ID
                </label>
                <Input
                  value={form.reddit_client_id || ""}
                  onChange={(e) => updateField("reddit_client_id", e.target.value)}
                  placeholder={maskKey(form.reddit_client_id || "") || "Enter ID"}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-mono text-cyber-text-muted">
                  Client Secret
                </label>
                <Input
                  type="password"
                  value={form.reddit_client_secret || ""}
                  onChange={(e) => updateField("reddit_client_secret", e.target.value)}
                  placeholder={maskKey(form.reddit_client_secret || "") || "Enter secret"}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-mono text-cyber-text-muted">
                  Username
                </label>
                <Input
                  value={form.reddit_username || ""}
                  onChange={(e) => updateField("reddit_username", e.target.value)}
                  placeholder="reddit_user"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-base">Medium API</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-mono text-cyber-text-muted">
                Access Token
              </label>
              <Input
                type="password"
                value={form.medium_access_token || ""}
                onChange={(e) => updateField("medium_access_token", e.target.value)}
                placeholder={maskKey(form.medium_access_token || "") || "Enter token"}
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
                placeholder={maskKey(form.devto_api_key || "") || "Enter key"}
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
                  placeholder={maskKey(form.blogger_client_id || "") || "Enter ID"}
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
                  placeholder={maskKey(form.blogger_client_secret || "") || "Enter secret"}
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
                  placeholder={maskKey(form.tumblr_consumer_key || "") || "Enter key"}
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
                  placeholder={maskKey(form.tumblr_consumer_secret || "") || "Enter secret"}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-mono text-cyber-text-muted">
                  Access Token
                </label>
                <Input
                  value={form.tumblr_access_token || ""}
                  onChange={(e) => updateField("tumblr_access_token", e.target.value)}
                  placeholder={maskKey(form.tumblr_access_token || "") || "Enter token"}
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
                  placeholder={maskKey(form.tumblr_access_secret || "") || "Enter secret"}
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

      <PlatformStatus platforms={platformConfigs} onTest={handleTest} />
    </div>
  );
}
