"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  FileText,
  CalendarClock,
  Settings,
  ExternalLink,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: FileText },
  { href: "/dashboard/schedule", label: "Schedule", icon: CalendarClock },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={cn(
          "fixed inset-0 z-30 bg-black/50 backdrop-blur-sm lg:hidden transition-opacity",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen w-64 border-r border-cyber-border bg-cyber-bg transition-transform duration-300 ease-in-out lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
        aria-label="Main navigation"
      >
        <div className="flex h-full flex-col">
          {/* Header with logo and close button */}
          <div className="flex h-16 items-center justify-between border-b border-cyber-border px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyber-red neon-red">
                <ExternalLink className="h-4 w-4 text-white" />
              </div>
              <div>
                <h1 className="font-heading text-base font-bold text-cyber-text">
                  Xylos
                </h1>
                <p className="font-mono text-[10px] text-cyber-text-muted leading-tight">
                  Backlinks
                </p>
              </div>
            </div>
            {/* Mobile close button */}
            <button
              onClick={() => setIsOpen(false)}
              className="lg:hidden p-1 rounded hover:bg-cyber-card-hover text-cyber-text-muted transition-colors"
              aria-label="Close sidebar"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-3 py-4" role="navigation" aria-label="Main">
            {navItems.map((item, index) => {
              const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={item.label}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-all",
                    isActive
                      ? "bg-cyber-red/10 text-cyber-red before:absolute before:left-0 before:h-8 before:w-0.5 before:rounded-r before:bg-cyber-red relative neon-cyan"
                      : "text-cyber-text-muted hover:bg-cyber-card-hover hover:text-cyber-text",
                    "animate-fade-in-up",
                    `delay-${(index + 1) * 100}`
                  )}
                >
                  <item.icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                  {item.label}
                  {isActive && <ChevronRight className="h-3 w-3 ml-auto text-cyber-red" aria-hidden="true" />}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="border-t border-cyber-border px-6 py-4 space-y-3">
            <div className="flex items-center justify-between">
              <p className="font-mono text-[10px] text-cyber-text-muted">v1.0.0</p>
              <span className="flex items-center gap-1.5">
                <span className="status-dot published" aria-label="System online" />
                <span className="font-mono text-[10px] text-green-400">Online</span>
              </span>
            </div>
            <p className="text-[10px] text-cyber-text-muted text-center">
              Rotating through 3 sitemaps every 6h
            </p>
          </div>
        </div>
      </aside>

      {/* Mobile menu button - only visible on mobile */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed lg:hidden bottom-6 right-6 z-50 p-3 rounded-full bg-cyber-red text-white neon-red shadow-lg"
        aria-label="Open navigation menu"
        aria-expanded={isOpen}
      >
        <Menu className="h-6 w-6" />
      </button>
    </>
  );
}