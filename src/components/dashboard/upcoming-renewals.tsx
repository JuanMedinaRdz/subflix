"use client";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SubLogo } from "@/components/subscriptions/sub-logo";
import { daysUntil, formatCurrency, formatDate } from "@/lib/utils";
import type { Subscription } from "@/types";

export function UpcomingRenewals({ items }: { items: Subscription[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming renewals</CardTitle>
        <CardDescription>Next 14 days</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {items.length === 0 && (
          <p className="text-sm text-muted-foreground py-8 text-center">
            No upcoming renewals. Enjoy the quiet!
          </p>
        )}
        {items.map((s, i) => {
          const d = daysUntil(s.nextRenewal);
          const variant =
            d < 0 ? "danger" : d <= 3 ? "warning" : "muted";
          const label =
            d < 0
              ? `${Math.abs(d)}d overdue`
              : d === 0
              ? "Today"
              : d === 1
              ? "Tomorrow"
              : `in ${d}d`;
          return (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-accent/40 transition-colors"
              data-testid="renewal-row"
            >
              <SubLogo name={s.name} logo={s.logo} color={s.color} size={36} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm truncate">{s.name}</span>
                  <Badge variant={variant}>{label}</Badge>
                </div>
                <span className="text-[11px] text-muted-foreground">
                  {formatDate(s.nextRenewal)}
                </span>
              </div>
              <span className="text-sm font-semibold tabular-nums">
                {formatCurrency(s.price, s.currency)}
              </span>
            </motion.div>
          );
        })}
      </CardContent>
    </Card>
  );
}
