"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { navItems, isActive } from "./nav-items";

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="hidden md:flex md:w-64 shrink-0 flex-col gap-1 p-4 border-r border-border/60 bg-background/40 backdrop-blur-xl">
      <Link href="/" className="flex items-center gap-3 px-2 py-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-brand shadow-lg shadow-primary/30">
          <Sparkles className="h-5 w-5 text-white" strokeWidth={2.5} />
        </div>
        <span className="font-display text-lg font-bold tracking-tight">
          Subflix
        </span>
      </Link>

      <nav className="mt-2 flex flex-col gap-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = isActive(pathname, href);
          return (
            <Link
              key={href}
              href={href}
              data-testid={`nav-${label.toLowerCase()}`}
              className={cn(
                "group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-accent text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
              )}
            >
              {active && (
                <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r-full gradient-brand" />
              )}
              <Icon
                className={cn(
                  "h-4 w-4 transition-colors",
                  active ? "text-primary" : ""
                )}
                strokeWidth={2}
              />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto rounded-xl glass-subtle p-4">
        <p className="text-xs font-semibold">Never get surprised again</p>
        <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
          Every renewal in one library, so a charge never catches you off guard.
        </p>
      </div>
    </aside>
  );
}
