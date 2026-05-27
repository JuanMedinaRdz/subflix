"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CreditCard,
  BarChart3,
  CalendarDays,
  Settings,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/subscriptions", label: "Subscriptions", icon: CreditCard },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/calendar", label: "Calendar", icon: CalendarDays },
  { href: "/settings", label: "Settings", icon: Settings }
];

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="hidden md:flex md:w-64 shrink-0 flex-col gap-2 p-4 border-r border-border/40 bg-card/30 backdrop-blur-xl">
      <div className="flex items-center gap-2 px-2 py-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-brand shadow-lg shadow-brand-500/30">
          <Sparkles className="h-5 w-5 text-white" strokeWidth={2.5} />
        </div>
        <div className="flex flex-col leading-none">
          <span className="text-base font-semibold tracking-tight">Subflix</span>
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
            Analytics
          </span>
        </div>
      </div>

      <nav className="mt-2 flex flex-col gap-1">
        {nav.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              data-testid={`nav-${label.toLowerCase()}`}
              className={cn(
                "group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-primary/10 text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/60"
              )}
            >
              {active && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-0.5 rounded-r gradient-brand" />
              )}
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto rounded-xl glass-subtle p-4">
        <p className="text-xs font-medium">Pro tip</p>
        <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
          Track every renewal in one place and never get charged by surprise again.
        </p>
      </div>
    </aside>
  );
}
