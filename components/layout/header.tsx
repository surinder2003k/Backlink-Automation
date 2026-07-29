"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";

export function Header() {
  const router = useRouter();

  const handleLogout = async () => {
    document.cookie = "xylos_auth=; path=/; max-age=0";
    router.push("/login");
    router.refresh();
  };

  return (
    <header className="fixed right-0 top-0 z-30 flex h-16 items-center justify-end gap-4 border-b border-cyber-border bg-cyber-bg/80 backdrop-blur-xl px-8" style={{ left: "256px" }}>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-cyber-card border border-cyber-border">
            <User className="h-4 w-4 text-cyber-text-muted" />
          </div>
          <span className="text-sm text-cyber-text-muted font-mono">
            sunny
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleLogout}
          title="Log out"
          aria-label="Log out"
          className="text-cyber-text-muted hover:text-cyber-red"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}
