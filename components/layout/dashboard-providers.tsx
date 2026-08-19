"use client";

import { ThemeProvider } from "next-themes";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { TopProgress } from "@/components/top-progress";
import { ReactNode } from "react";

export function DashboardProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      {children}
    </ThemeProvider>
  );
}