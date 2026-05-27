"use client";
import { Bell, Search, Command } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserMenu } from "./user-menu";

export function Topbar({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-border/40 bg-background/60 px-6 py-4 backdrop-blur-xl">
      <div className="min-w-0">
        <h1 className="text-xl font-semibold tracking-tight gradient-text">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
        )}
      </div>

      <div className="flex items-center gap-2">
        <div className="hidden md:flex items-center gap-2 rounded-lg border border-border/60 bg-card/40 px-3 py-1.5 text-xs text-muted-foreground">
          <Search className="h-3.5 w-3.5" />
          <span>Search subscriptions</span>
          <kbd className="ml-2 inline-flex items-center gap-0.5 rounded border border-border/60 bg-background/60 px-1.5 py-0.5 text-[10px]">
            <Command className="h-2.5 w-2.5" /> K
          </kbd>
        </div>
        <Button variant="ghost" size="icon" aria-label="Notifications">
          <Bell className="h-4 w-4" />
        </Button>
        <UserMenu />
      </div>
    </header>
  );
}
