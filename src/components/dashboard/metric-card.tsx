"use client";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowDownRight, ArrowUpRight, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function MetricCard({
  label,
  value,
  delta,
  icon: Icon,
  hint,
  testId
}: {
  label: string;
  value: string;
  delta?: number;
  icon: LucideIcon;
  hint?: string;
  testId?: string;
}) {
  const reduce = useReducedMotion();
  const up = (delta ?? 0) >= 0;
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      data-testid={testId}
      className="rounded-2xl border border-border/60 bg-card/40 p-5"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary text-muted-foreground">
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <div className="mt-4 flex items-baseline gap-2">
        <span className="truncate font-display text-3xl font-bold tracking-tight">
          {value}
        </span>
        {typeof delta === "number" && (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 text-xs font-medium",
              up ? "text-success" : "text-destructive"
            )}
          >
            {up ? (
              <ArrowUpRight className="h-3 w-3" />
            ) : (
              <ArrowDownRight className="h-3 w-3" />
            )}
            {Math.abs(delta).toFixed(1)}%
          </span>
        )}
      </div>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </motion.div>
  );
}
