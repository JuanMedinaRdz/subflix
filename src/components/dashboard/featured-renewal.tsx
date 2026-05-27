"use client";
import { motion } from "framer-motion";
import { CalendarClock, Pause, Pencil, Play, Sparkles } from "lucide-react";
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
  const d = daysUntil(sub.nextRenewal);
  const paused = sub.status === "paused";
  const label =
    paused
      ? "Paused"
      : d < 0
      ? `${Math.abs(d)} days overdue`
      : d === 0
      ? "Renews today"
      : d === 1
      ? "Renews tomorrow"
      : `Renews in ${d} days`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative overflow-hidden rounded-3xl border border-white/10"
      style={{
        background: `
          radial-gradient(ellipse 80% 60% at 20% 30%, ${sub.color}55, transparent 60%),
          radial-gradient(ellipse 60% 80% at 80% 80%, ${sub.color}33, transparent 60%),
          linear-gradient(135deg, #0a0d18 0%, #050710 100%)
        `
      }}
    >
      {/* Hero brand glow blob */}
      <div
        aria-hidden
        className="absolute -right-32 -top-32 h-96 w-96 rounded-full opacity-40 blur-3xl"
        style={{ background: sub.color }}
      />
      {/* Top brand line */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px opacity-80"
        style={{
          background: `linear-gradient(90deg, transparent, ${sub.color}, transparent)`
        }}
      />

      <div className="relative grid md:grid-cols-[1fr_auto] gap-6 p-6 md:p-10">
        <div className="flex flex-col gap-4 max-w-xl">
          <div className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.2em] text-white/60">
            <Sparkles className="h-3 w-3" /> Featured renewal
          </div>

          <div className="flex items-center gap-4">
            <SubLogo
              name={sub.name}
              logo={sub.logo}
              color={sub.color}
              size={68}
              className="!rounded-2xl ring-2 ring-white/10"
            />
            <div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
                {sub.name}
              </h1>
              <p className="text-sm text-white/60 mt-1">
                {sub.description ?? sub.category}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={d < 0 ? "danger" : d <= 3 ? "warning" : "muted"}>
              <CalendarClock className="h-3 w-3 mr-1" />
              {label}
            </Badge>
            <Badge variant="outline">{sub.category}</Badge>
            <Badge variant="outline">{sub.billingCycle}</Badge>
          </div>

          <div className="flex items-end gap-6 mt-2">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-white/50">
                Next charge
              </p>
              <p className="text-3xl md:text-4xl font-semibold tabular-nums mt-1">
                {formatCurrency(sub.price, sub.currency)}
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-white/50">
                Date
              </p>
              <p className="text-base mt-1">{formatDate(sub.nextRenewal)}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-2">
            {onToggle && (
              <Button
                variant="secondary"
                onClick={onToggle}
                className="bg-white/10 border-white/10 hover:bg-white/20 text-white"
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
                className="bg-white/10 border-white/10 hover:bg-white/20 text-white"
              >
                <Pencil className="h-4 w-4" /> Edit
              </Button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
