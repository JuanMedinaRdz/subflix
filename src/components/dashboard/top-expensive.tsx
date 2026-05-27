"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SubLogo } from "@/components/subscriptions/sub-logo";
import { formatCurrency } from "@/lib/utils";
import { toMonthly } from "@/lib/subscriptions";
import type { Subscription } from "@/types";

export function TopExpensive({ items }: { items: Subscription[] }) {
  const max = Math.max(
    ...items.map((s) => toMonthly(s.price, s.billingCycle)),
    1
  );
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top spend</CardTitle>
        <CardDescription>Most expensive monthly subscriptions</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.map((s) => {
          const m = toMonthly(s.price, s.billingCycle);
          const pct = (m / max) * 100;
          return (
            <div key={s.id} className="space-y-1.5">
              <div className="flex items-center gap-3">
                <SubLogo name={s.name} logo={s.logo} color={s.color} size={28} />
                <span className="text-sm font-medium flex-1 truncate">
                  {s.name}
                </span>
                <span className="text-sm tabular-nums font-semibold">
                  {formatCurrency(m)}
                </span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted/60">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${pct}%`,
                    background: `linear-gradient(90deg, ${s.color}cc, ${s.color}66)`
                  }}
                />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
