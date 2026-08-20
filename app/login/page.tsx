"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, Loader2, Eye, EyeOff, Lock, User as UserIcon } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.error || "Unable to sign in");
      }

      router.push("/dashboard");
      router.refresh();
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : "Unable to sign in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-cyber-bg grid-bg p-4 animate-fade-in-up">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8 animate-fade-in-up delay-100">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyber-red neon-red">
            <ExternalLink className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="font-heading text-2xl font-bold text-cyber-text">Xylos</h1>
            <p className="font-mono text-xs text-cyber-text-muted">Backlinks Automation</p>
          </div>
        </div>

        {/* Login Card */}
        <Card className="glass-card-lg animate-fade-in-up delay-200">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Sign In</CardTitle>
            <p className="text-sm text-cyber-text-muted mt-1">Enter your credentials to access the dashboard</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-mono text-cyber-text-muted">Username</label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-cyber-text-muted" />
                  <Input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    required
                    className="pl-10"
                    autoComplete="username"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-mono text-cyber-text-muted">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-cyber-text-muted" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    className="pl-10 pr-10"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-cyber-text-muted hover:text-cyber-cyan transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <p className="text-sm text-cyber-red flex items-center gap-2 animate-fade-in-up">
                  <span className="h-4 w-4 flex items-center justify-center rounded-full bg-cyber-red/20 text-cyber-red">
                    !
                  </span>
                  {error}
                </p>
              )}

              <Button
                type="submit"
                className="w-full py-3"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="mt-6 p-4 rounded-lg bg-cyber-card border border-cyber-border/50 animate-fade-in-up delay-300">
          <p className="text-xs text-cyber-text-muted text-center">
            Credentials are configured securely on the server.
          </p>
        </div>

        <p className="text-center text-xs text-cyber-text-muted mt-6 animate-fade-in-up delay-400">
          Backlink Automation Dashboard v1.0.0
        </p>
      </div>
    </div>
  );
}