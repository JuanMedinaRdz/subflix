"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { navItems, isActive } from "./nav-items";

// Native-style bottom tab bar for mobile / installed PWA. Hidden on md+ where
// the sidebar takes over. Sits above the home-indicator via safe-area inset.
export function MobileNav() {
  const pathname = usePathname();
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border/60 bg-background/85 backdrop-blur-xl md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="flex items-stretch justify-around">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = isActive(pathname, href);
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                data-testid={`mobilenav-${label.toLowerCase()}`}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 px-1 py-2 text-[10px] font-medium transition-colors",
                  active
                    ? "text-primary"
                    : "text-muted-foreground active:text-foreground"
                )}
              >
                <Icon
                  className="h-[1.35rem] w-[1.35rem]"
                  strokeWidth={active ? 2.4 : 2}
                />
                <span className="leading-none">{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
