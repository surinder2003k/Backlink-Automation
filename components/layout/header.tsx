"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOut, User, Sun, Moon, Menu, Bell } from "lucide-react";
import { useTheme } from "next-themes";

export function Header() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  const handleLogout = async () => {
    document.cookie = "xylos_auth=; path=/; max-age=0";
    router.push("/login");
    router.refresh();
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <header className="fixed right-0 top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-cyber-border bg-cyber-bg/80 backdrop-blur-xl px-4 lg:px-8" style={{ left: "256px" }}>
      {/* Left side - mobile menu button */}
      <div className="flex lg:hidden">
        <button
          id="mobile-menu-btn"
          className="p-2 rounded-lg hover:bg-cyber-card-hover text-cyber-text-muted transition-colors"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Center - page title (hidden on mobile) */}
      <div className="hidden md:flex-1 md:justify-center">
        <h1 className="font-heading text-lg font-bold text-cyber-text">
          Xylos Backlinks
        </h1>
      </div>

      {/* Right side - actions */}
      <div className="flex items-center gap-2">
        {/* Theme toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          className="text-cyber-text-muted hover:text-cyber-cyan"
        >
          {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>

        {/* Notifications */}
        <Button
          variant="ghost"
          size="icon"
          className="text-cyber-text-muted hover:text-cyber-orange relative"
          title="Notifications"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-cyber-red text-[10px] font-bold text-white">
            3
          </span>
        </Button>

        {/* User menu */}
        <div className="flex items-center gap-3 ml-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-cyber-card border border-cyber-border">
            <User className="h-4 w-4 text-cyber-text-muted" />
          </div>
          <span className="hidden sm:block text-sm text-cyber-text-muted font-mono">
            sunny
          </span>
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
      </div>
    </header>
  );
}