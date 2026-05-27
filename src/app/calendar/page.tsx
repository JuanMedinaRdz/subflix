"use client";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SubLogo } from "@/components/subscriptions/sub-logo";
import { useSubscriptions } from "@/hooks/use-subscriptions";
import { cn, formatCurrency } from "@/lib/utils";

function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

function daysInMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
}

export default function CalendarPage() {
  const { subscriptions } = useSubscriptions();
  const [cursor, setCursor] = useState(() => startOfMonth(new Date()));

  const monthLabel = cursor.toLocaleString("en-US", {
    month: "long",
    year: "numeric"
  });

  const days = daysInMonth(cursor);
  const firstWeekday = cursor.getDay(); // 0..6 (Sun..Sat)
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const renewalsByDay = useMemo(() => {
    const m = new Map<number, typeof subscriptions>();
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

  return (
    <AppShell
      title="Renewals calendar"
      subtitle="Visualize when your subscriptions will renew"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() =>
              setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))
            }
            aria-label="Previous month"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-lg font-semibold w-44 text-center">{monthLabel}</h2>
          <Button
            variant="outline"
            size="icon"
            onClick={() =>
              setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))
            }
            aria-label="Next month"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCursor(startOfMonth(new Date()))}
          >
            Today
          </Button>
        </div>
        <Badge variant="outline">
          {formatCurrency(monthlyTotal)} due this month
        </Badge>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-7 gap-2 mb-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <div
                key={d}
                className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground text-center py-2"
              >
                {d}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-2">
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
              const renewals = renewalsByDay.get(day) ?? [];
              const hasOverdue = renewals.some(
                (r) => isPast && r.status === "active"
              );

              return (
                <motion.div
                  key={day}
                  whileHover={{ y: -2 }}
                  className={cn(
                    "relative aspect-square rounded-xl p-2 border transition-colors flex flex-col",
                    isToday
                      ? "border-primary/60 bg-primary/5 ring-glow"
                      : "border-border/40 bg-card/30 hover:bg-accent/30",
                    isPast && !isToday && "opacity-70"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={cn(
                        "text-xs font-semibold",
                        isToday && "text-primary"
                      )}
                    >
                      {day}
                    </span>
                    {hasOverdue && (
                      <span className="h-1.5 w-1.5 rounded-full bg-destructive animate-pulse" />
                    )}
                  </div>
                  <div className="mt-auto flex flex-wrap gap-0.5">
                    {renewals.slice(0, 4).map((r) => (
                      <div
                        key={r.id}
                        title={`${r.name} • ${formatCurrency(r.price)}`}
                      >
                        <SubLogo
                          name={r.name}
                          logo={r.logo}
                          color={r.color}
                          size={18}
                        />
                      </div>
                    ))}
                    {renewals.length > 4 && (
                      <span className="text-[10px] text-muted-foreground self-end">
                        +{renewals.length - 4}
                      </span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </AppShell>
  );
}
