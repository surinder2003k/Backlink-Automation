"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, Loader2 } from "lucide-react";

const VALID_USERNAME = "sunny";
const VALID_PASSWORD = "3424";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (username === VALID_USERNAME && password === VALID_PASSWORD) {
      document.cookie = "xylos_auth=authenticated; path=/; max-age=86400";
      router.push("/dashboard");
      router.refresh();
    } else {
      setError("Invalid username or password");
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-cyber-bg p-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyber-red">
            <ExternalLink className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="font-heading text-xl font-bold text-cyber-text">
              Xylos
            </h1>
            <p className="font-mono text-xs text-cyber-text-muted">
              Backlinks
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">Sign In</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-mono text-cyber-text-muted">
                  Username
                </label>
                <Input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-mono text-cyber-text-muted">
                  Password
                </label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
              </div>

              {error && (
                <p className="text-sm text-cyber-red">{error}</p>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                Sign In
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-cyber-text-muted mt-6">
          Backlink Automation Dashboard
        </p>
      </div>
    </div>
  );
}
