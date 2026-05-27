import type { BillingCycle, CategoryTotal, Subscription } from "@/types";

export function toMonthly(price: number, cycle: BillingCycle): number {
  switch (cycle) {
    case "weekly":
      return price * 4.345;
    case "monthly":
      return price;
    case "quarterly":
      return price / 3;
    case "yearly":
      return price / 12;
  }
}

export function toYearly(price: number, cycle: BillingCycle): number {
  return toMonthly(price, cycle) * 12;
}

export function totalMonthly(subs: Subscription[]): number {
  return subs
    .filter((s) => s.status === "active")
    .reduce((acc, s) => acc + toMonthly(s.price, s.billingCycle), 0);
}

export function totalYearly(subs: Subscription[]): number {
  return totalMonthly(subs) * 12;
}

export function upcomingRenewals(subs: Subscription[], withinDays = 14): Subscription[] {
  const now = Date.now();
  const horizon = now + withinDays * 86400000;
  return subs
    .filter((s) => s.status === "active")
    .filter((s) => {
      const t = new Date(s.nextRenewal).getTime();
      return t >= now - 86400000 && t <= horizon;
    })
    .sort(
      (a, b) =>
        new Date(a.nextRenewal).getTime() - new Date(b.nextRenewal).getTime()
    );
}

export function overdue(subs: Subscription[]): Subscription[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return subs.filter(
    (s) => s.status === "active" && new Date(s.nextRenewal).getTime() < today.getTime()
  );
}

export function byCategory(subs: Subscription[]): CategoryTotal[] {
  const map = new Map<string, CategoryTotal>();
  for (const s of subs.filter((x) => x.status === "active")) {
    const cur = map.get(s.category) ?? {
      category: s.category,
      total: 0,
      count: 0
    };
    cur.total += toMonthly(s.price, s.billingCycle);
    cur.count += 1;
    map.set(s.category, cur);
  }
  return Array.from(map.values()).sort((a, b) => b.total - a.total);
}

export function monthlyTrend(subs: Subscription[], months = 12) {
  // Synthesize the trend: include sub in a month only if it was started by then
  const today = new Date();
  const data: { month: string; spend: number }[] = [];
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const label = d.toLocaleString("en-US", { month: "short" });
    const total = subs
      .filter(
        (s) =>
          s.status !== "cancelled" &&
          new Date(s.startedAt).getTime() <= d.getTime()
      )
      .reduce((acc, s) => acc + toMonthly(s.price, s.billingCycle), 0);
    data.push({ month: label, spend: Math.round(total * 100) / 100 });
  }
  return data;
}

export function topExpensive(subs: Subscription[], n = 5): Subscription[] {
  return [...subs]
    .filter((s) => s.status === "active")
    .sort(
      (a, b) =>
        toMonthly(b.price, b.billingCycle) - toMonthly(a.price, a.billingCycle)
    )
    .slice(0, n);
}
