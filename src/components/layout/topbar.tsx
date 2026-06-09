"use client";
import Link from "next/link";
import { Bell, Search, Command, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserMenu } from "./user-menu";

export function Topbar({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-border/60 bg-background/70 px-4 py-3.5 backdrop-blur-xl sm:px-6 sm:py-4">
      <div className="flex min-w-0 items-center gap-3">
        {/* Brand mark only on mobile, where the sidebar is hidden. */}
        <Link
          href="/"
          aria-label="Subflix home"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl gradient-brand shadow-lg shadow-primary/30 md:hidden"
        >
          <Sparkles className="h-5 w-5 text-white" strokeWidth={2.5} />
        </Link>
        <div className="min-w-0">
          <h1 className="truncate font-display text-lg font-bold tracking-tight text-foreground sm:text-xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-0.5 hidden truncate text-xs text-muted-foreground sm:block">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          className="hidden md:flex items-center gap-2 rounded-lg border border-border/60 bg-card/40 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-border hover:text-foreground"
        >
          <Search className="h-3.5 w-3.5" />
          <span>Search subscriptions</span>
          <kbd className="ml-2 inline-flex items-center gap-0.5 rounded border border-border/60 bg-background/60 px-1.5 py-0.5 text-[10px]">
            <Command className="h-2.5 w-2.5" /> K
          </kbd>
        </button>
        <Button variant="ghost" size="icon" aria-label="Notifications">
          <Bell className="h-4 w-4" />
        </Button>
        <UserMenu />
      </div>
    </header>
  );
}
