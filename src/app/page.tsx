"use client";
import { useMemo, useState } from "react";
import {
  CalendarClock,
  CreditCard,
  TrendingUp,
  Wallet,
  AlertCircle
} from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { FeaturedRenewal } from "@/components/dashboard/featured-renewal";
import { SubscriptionRow } from "@/components/dashboard/subscription-row";
import { SubscriptionTile } from "@/components/subscriptions/subscription-tile";
import { SubscriptionFormDialog } from "@/components/subscriptions/subscription-form";
import { Skeleton } from "@/components/ui/skeleton";
import { useSubscriptions } from "@/hooks/use-subscriptions";
import {
  byCategory,
  overdue,
  topExpensive,
  totalMonthly,
  totalYearly,
  upcomingRenewals
} from "@/lib/subscriptions";
import { formatCurrency } from "@/lib/utils";
import type { Subscription } from "@/types";

export default function DashboardPage() {
  const { subscriptions, hydrated, create, update, remove } = useSubscriptions();
  const [editing, setEditing] = useState<Subscription | null>(null);
  const [open, setOpen] = useState(false);

  const featured = useMemo(() => {
    if (subscriptions.length === 0) return null;
    const upcoming = upcomingRenewals(subscriptions, 60);
    return upcoming[0] ?? subscriptions[0];
  }, [subscriptions]);

  if (!hydrated) return <DashboardSkeleton />;

  const monthly = totalMonthly(subscriptions);
  const yearly = totalYearly(subscriptions);
  const upcoming = upcomingRenewals(subscriptions, 30);
  const past = overdue(subscriptions);
  const active = subscriptions.filter((s) => s.status === "active");
  const top = topExpensive(subscriptions, 10);
  const cats = byCategory(subscriptions);
  const recentlyAdded = [...subscriptions]
    .sort(
      (a, b) =>
        new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
    )
    .slice(0, 10);

  const openEdit = (sub: Subscription) => {
    setEditing(sub);
    setOpen(true);
  };
  const toggle = (sub: Subscription) =>
    update(sub.id, { status: sub.status === "paused" ? "active" : "paused" });

  return (
    <AppShell title="Browse" subtitle="Your subscription library">
      {/* HERO */}
      {featured && (
        <FeaturedRenewal
          sub={featured}
          onEdit={() => openEdit(featured)}
          onToggle={() => toggle(featured)}
        />
      )}

      {/* COMPACT METRIC STRIP */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
        <MetricChip
          icon={<Wallet className="h-4 w-4" />}
          label="Monthly"
          value={formatCurrency(monthly)}
          accent="from-brand-400/60 to-brand-700/60"
          testId="metric-monthly"
        />
        <MetricChip
          icon={<TrendingUp className="h-4 w-4" />}
          label="Yearly"
          value={formatCurrency(yearly)}
          accent="from-purple-400/60 to-purple-700/60"
          testId="metric-yearly"
        />
        <MetricChip
          icon={<CreditCard className="h-4 w-4" />}
          label="Active"
          value={String(active.length)}
          accent="from-emerald-400/60 to-emerald-700/60"
          testId="metric-active"
        />
        <MetricChip
          icon={<CalendarClock className="h-4 w-4" />}
          label="Renewing in 30d"
          value={String(upcoming.length)}
          accent="from-amber-400/60 to-orange-700/60"
          testId="metric-renewals"
        />
      </div>

      {/* OVERDUE BANNER */}
      {past.length > 0 && (
        <div className="mt-6 flex items-start gap-3 rounded-2xl border border-destructive/30 bg-destructive/5 p-4 backdrop-blur-sm">
          <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
          <div className="flex-1 text-sm">
            <p className="font-medium">
              {past.length} subscription{past.length > 1 ? "s are" : " is"} overdue
            </p>
            <p className="text-xs text-muted-foreground">
              {past.map((s) => s.name).join(", ")} — review their renewal dates.
            </p>
          </div>
        </div>
      )}

      {/* ROWS */}
      <div className="mt-10 space-y-10">
        {upcoming.length > 0 && (
          <SubscriptionRow
            title="Renewing soon"
            subtitle="Next 30 days"
            badge={`${upcoming.length}`}
          >
            {upcoming.map((s) => (
              <Tile
                key={s.id}
                sub={s}
                onEdit={() => openEdit(s)}
                onToggle={() => toggle(s)}
              />
            ))}
          </SubscriptionRow>
        )}

        <SubscriptionRow
          title="Top spend"
          subtitle="Highest monthly cost"
          badge={formatCurrency(monthly) + " / mo"}
        >
          {top.map((s) => (
            <Tile
              key={s.id}
              sub={s}
              onEdit={() => openEdit(s)}
              onToggle={() => toggle(s)}
            />
          ))}
        </SubscriptionRow>

        <SubscriptionRow title="Recently added">
          {recentlyAdded.map((s) => (
            <Tile
              key={s.id}
              sub={s}
              onEdit={() => openEdit(s)}
              onToggle={() => toggle(s)}
            />
          ))}
        </SubscriptionRow>

        {cats.map((c) => {
          const items = subscriptions.filter((s) => s.category === c.category);
          if (items.length === 0) return null;
          return (
            <SubscriptionRow
              key={c.category}
              title={c.category}
              subtitle={`${c.count} subscription${c.count > 1 ? "s" : ""}`}
              badge={formatCurrency(c.total) + " / mo"}
            >
              {items.map((s) => (
                <Tile
                  key={s.id}
                  sub={s}
                  onEdit={() => openEdit(s)}
                  onToggle={() => toggle(s)}
                />
              ))}
            </SubscriptionRow>
          );
        })}
      </div>

      <SubscriptionFormDialog
        open={open}
        onOpenChange={setOpen}
        mode={editing ? { kind: "edit", sub: editing } : null}
        onSubmit={(data) => {
          if (editing) {
            const { id, ...patch } = data;
            if (id) update(id, patch);
          } else {
            const { id: _ignore, ...rest } = data;
            create(rest);
          }
          setEditing(null);
        }}
      />
    </AppShell>
  );
}

function Tile({
  sub,
  onEdit,
  onToggle
}: {
  sub: Subscription;
  onEdit: () => void;
  onToggle: () => void;
}) {
  return (
    <div className="snap-start">
      <SubscriptionTile sub={sub} onEdit={onEdit} onToggle={onToggle} />
    </div>
  );
}

function MetricChip({
  icon,
  label,
  value,
  accent,
  testId
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent: string;
  testId?: string;
}) {
  return (
    <div
      data-testid={testId}
      className="relative overflow-hidden rounded-xl glass px-4 py-3 flex items-center gap-3"
    >
      <div
        className={`flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br text-white ${accent}`}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
          {label}
        </p>
        <p className="text-base font-semibold tabular-nums truncate">{value}</p>
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <AppShell title="Browse">
      <Skeleton className="h-64 rounded-3xl" />
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-16 rounded-xl" />
        ))}
      </div>
      <div className="mt-10 space-y-10">
        {Array.from({ length: 3 }).map((_, r) => (
          <div key={r}>
            <Skeleton className="h-6 w-48 mb-3" />
            <div className="flex gap-3 overflow-hidden">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton
                  key={i}
                  className="aspect-[16/10] w-[240px] shrink-0 rounded-xl"
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
