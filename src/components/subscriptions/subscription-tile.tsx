"use client";
import { motion, useReducedMotion } from "framer-motion";
import { CalendarDays, Pause, Pencil, Play } from "lucide-react";
import { SubLogo } from "./sub-logo";
import { Badge } from "@/components/ui/badge";
import { cn, daysUntil, formatCurrency, formatDate } from "@/lib/utils";
import type { Subscription } from "@/types";

export function SubscriptionTile({
  sub,
  onEdit,
  onToggle,
  priority
}: {
  sub: Subscription;
  onEdit?: () => void;
  onToggle?: () => void;
  priority?: boolean;
}) {
  const reduce = useReducedMotion();
  const d = daysUntil(sub.nextRenewal);
  const paused = sub.status === "paused";

  const renewalBadge = paused
    ? { variant: "muted" as const, label: "Paused" }
    : d < 0
    ? { variant: "danger" as const, label: `${Math.abs(d)}d overdue` }
    : d === 0
    ? { variant: "warning" as const, label: "Today" }
    : d === 1
    ? { variant: "warning" as const, label: "Tomorrow" }
    : d <= 7
    ? { variant: "warning" as const, label: `in ${d}d` }
    : { variant: "muted" as const, label: `in ${d}d` };

  const cycle =
    sub.billingCycle === "monthly"
      ? "mo"
      : sub.billingCycle === "yearly"
      ? "yr"
      : sub.billingCycle === "weekly"
      ? "wk"
      : "qtr";

  return (
    <motion.div
      data-testid="subscription-tile"
      data-sub-id={sub.id}
      whileHover={reduce ? undefined : { scale: 1.06, zIndex: 20 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "group relative w-[220px] sm:w-[240px] md:w-[260px] shrink-0 aspect-[16/10] rounded-xl overflow-hidden cursor-pointer",
        "ring-1 ring-white/5 hover:ring-white/20",
        "shadow-[0_10px_30px_-10px_rgba(0,0,0,0.6)] hover:shadow-[0_20px_60px_-10px_rgba(0,0,0,0.8)]",
        paused && "opacity-70"
      )}
      style={{
        background: `radial-gradient(circle at 30% 20%, ${sub.color}33, transparent 60%), linear-gradient(135deg, ${sub.color}22 0%, #0a0d18 75%)`
      }}
    >
      {/* Top brand bar */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-[2px]"
        style={{
          background: `linear-gradient(90deg, transparent, ${sub.color}, transparent)`
        }}
      />

      {/* Subtle noise / vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-transparent" />

      {/* Centered logo + name (always visible) */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4 transition-opacity duration-200 group-hover:opacity-0">
        <SubLogo
          name={sub.name}
          logo={sub.logo}
          color={sub.color}
          size={48}
          className="!rounded-2xl"
        />
        <span className="font-display text-base font-bold tracking-tight text-white/95">
          {sub.name}
        </span>
        <Badge variant={renewalBadge.variant}>{renewalBadge.label}</Badge>
      </div>

      {/* Hover detail overlay */}
      <div
        className={cn(
          "absolute inset-0 flex flex-col justify-between p-4",
          "opacity-0 group-hover:opacity-100 transition-opacity duration-200",
          "bg-gradient-to-b from-black/30 via-black/60 to-black/90"
        )}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <SubLogo
              name={sub.name}
              logo={sub.logo}
              color={sub.color}
              size={36}
            />
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate">{sub.name}</p>
              <p className="text-[10px] uppercase tracking-widest text-white/50 truncate">
                {sub.category}
              </p>
            </div>
          </div>
          <Badge variant={renewalBadge.variant}>{renewalBadge.label}</Badge>
        </div>

        <div className="space-y-2">
          {sub.description && (
            <p className="text-[11px] leading-snug text-white/70 line-clamp-2">
              {sub.description}
            </p>
          )}

          <div className="flex items-end justify-between">
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-semibold tabular-nums text-white">
                  {formatCurrency(sub.price, sub.currency)}
                </span>
                <span className="text-[10px] text-white/60">/{cycle}</span>
              </div>
              <div className="mt-0.5 flex items-center gap-1 text-[10px] text-white/60">
                <CalendarDays className="h-3 w-3" />
                {formatDate(sub.nextRenewal)}
              </div>
            </div>
            <div className="flex items-center gap-1">
              {onToggle && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggle();
                  }}
                  className="h-8 w-8 inline-flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/10 transition-colors"
                  aria-label={paused ? "Resume" : "Pause"}
                  title={paused ? "Resume" : "Pause"}
                >
                  {paused ? (
                    <Play className="h-3.5 w-3.5" />
                  ) : (
                    <Pause className="h-3.5 w-3.5" />
                  )}
                </button>
              )}
              {onEdit && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit();
                  }}
                  className="h-8 w-8 inline-flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/10 transition-colors"
                  aria-label="Edit"
                  title="Edit"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
