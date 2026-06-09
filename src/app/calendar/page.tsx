"use client";
import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, CalendarX } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SubLogo } from "@/components/subscriptions/sub-logo";
import { useSubscriptions } from "@/hooks/use-subscriptions";
import { cn, formatCurrency, formatDate } from "@/lib/utils";
import type { Subscription } from "@/types";

function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

function daysInMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
}

export default function CalendarPage() {
  const { subscriptions } = useSubscriptions();
  const reduce = useReducedMotion();
  const [cursor, setCursor] = useState(() => startOfMonth(new Date()));

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Preselect today when the visible month contains it, so the detail panel
  // is useful on first load.
  const [selectedDay, setSelectedDay] = useState<number | null>(() =>
    today.getMonth() === cursor.getMonth() &&
    today.getFullYear() === cursor.getFullYear()
      ? today.getDate()
      : null
  );

  const goToMonth = (offset: number) => {
    const next = new Date(cursor.getFullYear(), cursor.getMonth() + offset, 1);
    setCursor(next);
    setSelectedDay(
      today.getMonth() === next.getMonth() &&
        today.getFullYear() === next.getFullYear()
        ? today.getDate()
        : null
    );
  };

  const monthLabel = cursor.toLocaleString("en-US", {
    month: "long",
    year: "numeric"
  });

  const days = daysInMonth(cursor);
  const firstWeekday = cursor.getDay(); // 0..6 (Sun..Sat)

  const renewalsByDay = useMemo(() => {
    const m = new Map<number, Subscription[]>();
    for (const s of subscriptions) {
      const r = new Date(s.nextRenewal);
      if (
        r.getMonth() === cursor.getMonth() &&
        r.getFullYear() === cursor.getFullYear()
      ) {
        const day = r.getDate();
        const arr = m.get(day) ?? [];
        arr.push(s);
        m.set(day, arr);
      }
    }
    return m;
  }, [subscriptions, cursor]);

  const monthlyTotal = Array.from(renewalsByDay.values())
    .flat()
    .filter((s) => s.status === "active")
    .reduce((acc, s) => acc + s.price, 0);

  const cells = [
    ...Array.from({ length: firstWeekday }, () => null as number | null),
    ...Array.from({ length: days }, (_, i) => i + 1)
  ];

  const selectedDate =
    selectedDay != null
      ? new Date(cursor.getFullYear(), cursor.getMonth(), selectedDay)
      : null;
  const selectedRenewals = selectedDay != null ? renewalsByDay.get(selectedDay) ?? [] : [];
  const selectedTotal = selectedRenewals
    .filter((s) => s.status === "active")
    .reduce((acc, s) => acc + s.price, 0);

  return (
    <AppShell
      title="Renewals calendar"
      subtitle="Visualize when your subscriptions will renew"
    >
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => goToMonth(-1)}
            aria-label="Previous month"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h2 className="w-36 text-center font-display text-lg font-bold capitalize sm:w-44">
            {monthLabel}
          </h2>
          <Button
            variant="outline"
            size="icon"
            onClick={() => goToMonth(1)}
            aria-label="Next month"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => goToMonth(0)}>
            Today
          </Button>
        </div>
        <Badge variant="outline" className="self-start sm:self-auto">
          {formatCurrency(monthlyTotal)} due this month
        </Badge>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_22rem] lg:items-start">
        <Card>
          <CardContent className="p-2 sm:p-4">
            <div className="mb-2 grid grid-cols-7 gap-1 sm:gap-2">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                <div
                  key={d}
                  className="py-2 text-center text-[10px] font-semibold uppercase tracking-widest text-muted-foreground"
                >
                  {d}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1 sm:gap-2">
              {cells.map((day, i) => {
                if (day === null)
                  return <div key={`empty-${i}`} className="aspect-square" />;
                const dayDate = new Date(
                  cursor.getFullYear(),
                  cursor.getMonth(),
                  day
                );
                dayDate.setHours(0, 0, 0, 0);
                const isToday = dayDate.getTime() === today.getTime();
                const isPast = dayDate.getTime() < today.getTime();
                const isSelected = day === selectedDay;
                const renewals = renewalsByDay.get(day) ?? [];
                const hasOverdue = renewals.some(
                  (r) => isPast && r.status === "active"
                );

                return (
                  <motion.button
                    key={day}
                    type="button"
                    onClick={() => setSelectedDay(day)}
                    whileHover={reduce ? undefined : { y: -2 }}
                    aria-pressed={isSelected}
                    aria-label={`${formatDate(dayDate)}, ${
                      renewals.length
                    } renewal${renewals.length === 1 ? "" : "s"}`}
                    className={cn(
                      "relative flex aspect-square flex-col rounded-xl border p-1 text-left transition-colors sm:p-2",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      isSelected
                        ? "border-primary bg-primary/10 ring-2 ring-primary"
                        : isToday
                        ? "border-primary/60 bg-primary/5"
                        : "border-border/40 bg-card/30 hover:bg-accent/40",
                      isPast && !isToday && !isSelected && "opacity-70"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={cn(
                          "text-xs font-semibold",
                          (isToday || isSelected) && "text-primary"
                        )}
                      >
                        {day}
                      </span>
                      {hasOverdue && (
                        <span className="h-1.5 w-1.5 rounded-full bg-destructive" />
                      )}
                    </div>
                    <div className="mt-auto flex flex-wrap gap-0.5">
                      {renewals.slice(0, 4).map((r) => (
                        <SubLogo
                          key={r.id}
                          name={r.name}
                          logo={r.logo}
                          color={r.color}
                          size={18}
                        />
                      ))}
                      {renewals.length > 4 && (
                        <span className="self-end text-[10px] text-muted-foreground">
                          +{renewals.length - 4}
                        </span>
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <DayDetail
          date={selectedDate}
          renewals={selectedRenewals}
          total={selectedTotal}
          today={today}
        />
      </div>
    </AppShell>
  );
}

function DayDetail({
  date,
  renewals,
  total,
  today
}: {
  date: Date | null;
  renewals: Subscription[];
  total: number;
  today: Date;
}) {
  return (
    <Card className="lg:sticky lg:top-24">
      <CardContent className="p-5">
        {date == null ? (
          <div className="flex flex-col items-center gap-2 py-8 text-center">
            <CalendarX className="h-6 w-6 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Select a day to see its renewals.
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-baseline justify-between gap-2">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
                  Selected day
                </p>
                <p className="font-display text-lg font-bold">
                  {formatDate(date, { weekday: "long" })}
                </p>
              </div>
              {renewals.length > 0 && (
                <p className="font-display text-lg font-bold tabular-nums">
                  {formatCurrency(total)}
                </p>
              )}
            </div>

            {renewals.length === 0 ? (
              <p className="mt-6 text-sm text-muted-foreground">
                No renewals on this day.
              </p>
            ) : (
              <ul className="mt-4 flex flex-col gap-2">
                {renewals.map((s) => {
                  const isPast = date.getTime() < today.getTime();
                  const overdue = isPast && s.status === "active";
                  const badge =
                    s.status === "paused"
                      ? { variant: "muted" as const, label: "Paused" }
                      : overdue
                      ? { variant: "danger" as const, label: "Overdue" }
                      : { variant: "muted" as const, label: s.category };
                  return (
                    <li
                      key={s.id}
                      className="flex items-center gap-3 rounded-xl border border-border/50 bg-card/40 p-3"
                    >
                      <SubLogo
                        name={s.name}
                        logo={s.logo}
                        color={s.color}
                        size={36}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold">{s.name}</p>
                        <p className="truncate text-xs text-muted-foreground">
                          {s.description ?? s.category}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-sm font-semibold tabular-nums">
                          {formatCurrency(s.price, s.currency)}
                        </span>
                        <Badge variant={badge.variant}>{badge.label}</Badge>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
