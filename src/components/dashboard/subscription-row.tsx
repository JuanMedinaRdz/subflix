"use client";
import { useRef, useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function SubscriptionRow({
  title,
  subtitle,
  badge,
  children
}: {
  title: string;
  subtitle?: string;
  badge?: string;
  children: React.ReactNode;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  const updateButtons = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 8);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
  }, []);

  useEffect(() => {
    updateButtons();
    const el = scrollerRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateButtons, { passive: true });
    const ro = new ResizeObserver(updateButtons);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", updateButtons);
      ro.disconnect();
    };
  }, [updateButtons]);

  const scrollBy = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: "smooth" });
  };

  return (
    <section className="group/row relative">
      <div className="flex items-end justify-between gap-3 mb-3 px-1">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="font-display text-xl md:text-2xl font-bold tracking-tight">
              {title}
            </h2>
            {badge && (
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground border border-border/60 rounded-full px-2 py-0.5">
                {badge}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>

      <div className="relative">
        {/* Left fade + arrow */}
        <button
          onClick={() => scrollBy(-1)}
          aria-label="Scroll left"
          className={cn(
            "hidden md:flex absolute -left-2 top-0 bottom-0 z-10 w-12 items-center justify-start pl-1",
            "opacity-0 group-hover/row:opacity-100 transition-opacity",
            !canLeft && "pointer-events-none !opacity-0"
          )}
        >
          <span className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
          <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/10 hover:bg-white/20 transition-colors">
            <ChevronLeft className="h-4 w-4" />
          </span>
        </button>

        <div
          ref={scrollerRef}
          className="flex gap-3 overflow-x-auto pb-6 pt-2 px-1 snap-x snap-mandatory scroll-px-4 scrollbar-hide"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none"
          }}
        >
          {/* hide webkit scrollbar */}
          <style jsx>{`
            div::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          {children}
        </div>

        <button
          onClick={() => scrollBy(1)}
          aria-label="Scroll right"
          className={cn(
            "hidden md:flex absolute -right-2 top-0 bottom-0 z-10 w-12 items-center justify-end pr-1",
            "opacity-0 group-hover/row:opacity-100 transition-opacity",
            !canRight && "pointer-events-none !opacity-0"
          )}
        >
          <span className="absolute inset-0 bg-gradient-to-l from-background via-background/80 to-transparent" />
          <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/10 hover:bg-white/20 transition-colors">
            <ChevronRight className="h-4 w-4" />
          </span>
        </button>
      </div>
    </section>
  );
}
