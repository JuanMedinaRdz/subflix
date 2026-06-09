"use client";
import { motion, useReducedMotion } from "framer-motion";
import {
  MoreHorizontal,
  Pencil,
  Pause,
  Play,
  Trash2,
  CalendarDays
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SubLogo } from "./sub-logo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { daysUntil, formatCurrency, formatDate } from "@/lib/utils";
import type { Subscription } from "@/types";

export function SubscriptionCard({
  sub,
  onEdit,
  onDelete,
  onToggle
}: {
  sub: Subscription;
  onEdit: () => void;
  onDelete: () => void;
  onToggle: () => void;
}) {
  const reduce = useReducedMotion();
  const d = daysUntil(sub.nextRenewal);
  const renewalBadge =
    sub.status === "paused"
      ? { variant: "muted" as const, label: "Paused" }
      : d < 0
      ? { variant: "danger" as const, label: `${Math.abs(d)}d overdue` }
      : d <= 3
      ? { variant: "warning" as const, label: d === 0 ? "Today" : `in ${d}d` }
      : { variant: "muted" as const, label: `in ${d}d` };

  return (
    <motion.div
      layout
      initial={reduce ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduce ? undefined : { opacity: 0, scale: 0.96 }}
      whileHover={reduce ? undefined : { y: -2 }}
      transition={{ duration: 0.25 }}
      data-testid="subscription-card"
      data-sub-id={sub.id}
      className="group relative rounded-2xl glass p-5 overflow-hidden"
    >
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px opacity-60"
        style={{
          background: `linear-gradient(90deg, transparent, ${sub.color}, transparent)`
        }}
      />
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <SubLogo name={sub.name} logo={sub.logo} color={sub.color} size={44} />
          <div className="min-w-0">
            <h3 className="font-display text-base font-bold truncate">
              {sub.name}
            </h3>
            <p className="text-xs text-muted-foreground truncate">
              {sub.description ?? sub.category}
            </p>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="opacity-60 hover:opacity-100"
              aria-label="Actions"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onEdit}>
              <Pencil className="h-3.5 w-3.5" /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onToggle}>
              {sub.status === "paused" ? (
                <>
                  <Play className="h-3.5 w-3.5" /> Resume
                </>
              ) : (
                <>
                  <Pause className="h-3.5 w-3.5" /> Pause
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onDelete} className="text-destructive">
              <Trash2 className="h-3.5 w-3.5" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="mt-4 flex items-end justify-between">
        <div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-semibold tracking-tight">
              {formatCurrency(sub.price, sub.currency)}
            </span>
            <span className="text-xs text-muted-foreground">
              /{sub.billingCycle === "monthly" ? "mo" : sub.billingCycle === "yearly" ? "yr" : sub.billingCycle}
            </span>
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <CalendarDays className="h-3 w-3" />
            {formatDate(sub.nextRenewal)}
          </div>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <Badge variant="outline">{sub.category}</Badge>
          <Badge variant={renewalBadge.variant}>{renewalBadge.label}</Badge>
        </div>
      </div>
    </motion.div>
  );
}
