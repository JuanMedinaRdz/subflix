"use client";
import { motion, useReducedMotion } from "framer-motion";
import { CalendarClock, Pause, Pencil, Play } from "lucide-react";
import { SubLogo } from "@/components/subscriptions/sub-logo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { daysUntil, formatCurrency, formatDate } from "@/lib/utils";
import type { Subscription } from "@/types";

export function FeaturedRenewal({
  sub,
  onEdit,
  onToggle
}: {
  sub: Subscription;
  onEdit?: () => void;
  onToggle?: () => void;
}) {
  const reduce = useReducedMotion();
  const d = daysUntil(sub.nextRenewal);
  const paused = sub.status === "paused";
  const label = paused
    ? "Paused"
    : d < 0
    ? `${Math.abs(d)} days overdue`
    : d === 0
    ? "Renews today"
    : d === 1
    ? "Renews tomorrow"
    : `Renews in ${d} days`;

  return (
    <motion.section
      initial={reduce ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="relative isolate overflow-hidden rounded-2xl border border-white/10"
      style={{
        // Poster artwork: brand color blooms from the right, a dark scrim on
        // the left keeps the headline legible. Cinematic, catalogue-style.
        background: `
          linear-gradient(100deg, hsl(240 10% 4%) 0%, hsl(240 10% 4% / 0.92) 34%, transparent 92%),
          radial-gradient(115% 130% at 100% 0%, ${sub.color}66, transparent 55%),
          radial-gradient(90% 90% at 88% 110%, ${sub.color}38, transparent 60%),
          linear-gradient(135deg, ${sub.color}1f 0%, hsl(240 10% 4%) 70%)
        `
      }}
    >
      {/* Top brand hairline */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px opacity-70"
        style={{
          background: `linear-gradient(90deg, transparent, ${sub.color}, transparent)`
        }}
      />

      <div className="relative flex min-h-[300px] flex-col justify-end gap-5 p-6 md:min-h-[360px] md:p-10">
        <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-white/55">
          Up next
        </p>

        <div className="flex items-center gap-4">
          <SubLogo
            name={sub.name}
            logo={sub.logo}
            color={sub.color}
            size={64}
            className="!rounded-2xl ring-2 ring-white/10"
          />
          <div className="min-w-0">
            <h2 className="font-display text-4xl font-bold leading-[0.95] tracking-tight text-white md:text-6xl">
              {sub.name}
            </h2>
            <p className="mt-1.5 text-sm text-white/60">
              {sub.description ?? sub.category}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={d < 0 ? "danger" : d <= 3 ? "warning" : "muted"}>
            <CalendarClock className="mr-1 h-3 w-3" />
            {label}
          </Badge>
          <Badge variant="outline">{sub.category}</Badge>
          <Badge variant="outline">{sub.billingCycle}</Badge>
        </div>

        <div className="flex flex-wrap items-end gap-x-8 gap-y-4">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-white/45">
              Next charge
            </p>
            <p className="mt-1 font-display text-3xl font-bold tabular-nums text-white md:text-4xl">
              {formatCurrency(sub.price, sub.currency)}
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-white/45">
              Date
            </p>
            <p className="mt-1 text-base text-white/90">
              {formatDate(sub.nextRenewal)}
            </p>
          </div>

          <div className="ml-auto flex items-center gap-2">
            {onToggle && (
              <Button
                variant="secondary"
                onClick={onToggle}
                className="border-white/10 bg-white/10 text-white hover:bg-white/20"
              >
                {paused ? (
                  <>
                    <Play className="h-4 w-4" /> Resume
                  </>
                ) : (
                  <>
                    <Pause className="h-4 w-4" /> Pause
                  </>
                )}
              </Button>
            )}
            {onEdit && (
              <Button
                variant="secondary"
                onClick={onEdit}
                className="border-white/10 bg-white/10 text-white hover:bg-white/20"
              >
                <Pencil className="h-4 w-4" /> Edit
              </Button>
            )}
          </div>
        </div>
      </div>
    </motion.section>
  );
}
