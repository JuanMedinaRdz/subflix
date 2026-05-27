"use client";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { TrendingUp, DollarSign, Layers, Crown } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { MetricCard } from "@/components/dashboard/metric-card";
import { useSubscriptions } from "@/hooks/use-subscriptions";
import {
  byCategory,
  monthlyTrend,
  toMonthly,
  topExpensive,
  totalMonthly,
  totalYearly
} from "@/lib/subscriptions";
import { formatCurrency } from "@/lib/utils";

const COLORS = [
  "hsl(226 100% 64%)",
  "hsl(280 100% 64%)",
  "hsl(190 90% 55%)",
  "hsl(150 70% 55%)",
  "hsl(38 95% 60%)",
  "hsl(340 90% 65%)",
  "hsl(200 60% 60%)",
  "hsl(60 70% 60%)",
  "hsl(0 80% 65%)"
];

const tooltipStyle = {
  background: "rgba(10, 12, 20, 0.95)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 12,
  fontSize: 12
};

export default function AnalyticsPage() {
  const { subscriptions } = useSubscriptions();
  const monthly = totalMonthly(subscriptions);
  const yearly = totalYearly(subscriptions);
  const cats = byCategory(subscriptions);
  const trend = monthlyTrend(subscriptions, 12);
  const top = topExpensive(subscriptions, 8).map((s) => ({
    name: s.name,
    value: Math.round(toMonthly(s.price, s.billingCycle) * 100) / 100,
    color: s.color
  }));
  const avg = subscriptions.length
    ? monthly / subscriptions.filter((s) => s.status === "active").length
    : 0;

  const yoy = trend.length > 1 ? ((trend[trend.length - 1].spend - trend[0].spend) / Math.max(trend[0].spend, 1)) * 100 : 0;

  return (
    <AppShell title="Analytics" subtitle="Insights across your subscription portfolio">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Monthly cost"
          value={formatCurrency(monthly)}
          icon={DollarSign}
          accent="from-brand-400 to-brand-700"
        />
        <MetricCard
          label="Yearly cost"
          value={formatCurrency(yearly)}
          icon={TrendingUp}
          delta={yoy}
          accent="from-purple-400 to-purple-700"
        />
        <MetricCard
          label="Avg / subscription"
          value={formatCurrency(avg)}
          icon={Layers}
          accent="from-cyan-400 to-blue-700"
        />
        <MetricCard
          label="Most expensive"
          value={top[0]?.name ?? "—"}
          hint={top[0] ? formatCurrency(top[0].value) + " / mo" : ""}
          icon={Crown}
          accent="from-amber-400 to-orange-700"
        />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Monthly spend trend</CardTitle>
            <CardDescription>Reconstructed from subscription start dates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer>
                <LineChart data={trend} margin={{ left: -16, right: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                  <XAxis dataKey="month" stroke="rgba(255,255,255,0.4)" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="rgba(255,255,255,0.4)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} />
                  <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [formatCurrency(v), "Spend"]} />
                  <Line
                    type="monotone"
                    dataKey="spend"
                    stroke="hsl(226 100% 64%)"
                    strokeWidth={2.5}
                    dot={{ fill: "hsl(226 100% 64%)", r: 3 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>By category</CardTitle>
            <CardDescription>Monthly contribution per category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer>
                <BarChart data={cats} layout="vertical" margin={{ left: 16 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" horizontal={false} />
                  <XAxis type="number" stroke="rgba(255,255,255,0.4)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} />
                  <YAxis type="category" dataKey="category" stroke="rgba(255,255,255,0.5)" fontSize={11} tickLine={false} axisLine={false} width={80} />
                  <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [formatCurrency(v), "Monthly"]} />
                  <Bar dataKey="total" radius={[0, 8, 8, 0]}>
                    {cats.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Top subscriptions</CardTitle>
          <CardDescription>Highest monthly cost contributors</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={top} margin={{ left: -8, right: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.4)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="rgba(255,255,255,0.4)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [formatCurrency(v), "Monthly"]} />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {top.map((t, i) => (
                    <Cell key={i} fill={t.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </AppShell>
  );
}
