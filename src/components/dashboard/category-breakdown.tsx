"use client";
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import type { CategoryTotal } from "@/types";

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

export function CategoryBreakdown({ data }: { data: CategoryTotal[] }) {
  const total = data.reduce((a, b) => a + b.total, 0);
  return (
    <Card>
      <CardHeader>
        <CardTitle>By category</CardTitle>
        <CardDescription>Monthly spend per category</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative h-44">
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={data}
                dataKey="total"
                nameKey="category"
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={75}
                paddingAngle={2}
                strokeWidth={0}
              >
                {data.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "rgba(10, 12, 20, 0.95)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 12,
                  fontSize: 12
                }}
                formatter={(v: number, n) => [formatCurrency(v), n as string]}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
              total / mo
            </span>
            <span className="text-lg font-semibold">{formatCurrency(total)}</span>
          </div>
        </div>
        <ul className="mt-4 space-y-2">
          {data.slice(0, 5).map((c, i) => (
            <li key={c.category} className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-2">
                <span
                  className="inline-block h-2 w-2 rounded-full"
                  style={{ background: COLORS[i % COLORS.length] }}
                />
                <span className="text-muted-foreground">{c.category}</span>
              </span>
              <span className="font-medium tabular-nums">
                {formatCurrency(c.total)}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
