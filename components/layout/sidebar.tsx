"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FileText,
  CalendarClock,
  Settings,
  ExternalLink,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/posts", label: "Posts", icon: FileText },
  { href: "/dashboard/schedule", label: "Schedule", icon: CalendarClock },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-cyber-border bg-cyber-bg">
      <div className="flex h-full flex-col">
        <div className="flex h-16 items-center gap-3 border-b border-cyber-border px-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyber-red">
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

        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                title={item.label}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-all",
                  isActive
                    ? "bg-cyber-red/10 text-cyber-red before:absolute before:left-0 before:h-8 before:w-0.5 before:rounded-r before:bg-cyber-red relative"
                    : "text-cyber-text-muted hover:bg-cyber-card-hover hover:text-cyber-text"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-cyber-border px-6 py-4">
          <p className="font-mono text-[10px] text-cyber-text-muted">
            v1.0.0
          </p>
        </div>
      </div>
    </aside>
  );
}
