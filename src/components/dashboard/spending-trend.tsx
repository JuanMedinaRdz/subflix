"use client";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

type Point = { month: string; spend: number };

export function SpendingTrend({ data }: { data: Point[] }) {
  return (
    <Card className="col-span-2">
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle>Spending trend</CardTitle>
          <CardDescription>Monthly cost over the last 12 months</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-72 w-full">
          <ResponsiveContainer>
            <AreaChart data={data} margin={{ left: -16, right: 8, top: 8 }}>
              <defs>
                <linearGradient id="spend-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(226 100% 64%)" stopOpacity={0.7} />
                  <stop offset="100%" stopColor="hsl(280 100% 64%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis
                dataKey="month"
                stroke="rgba(255,255,255,0.4)"
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="rgba(255,255,255,0.4)"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `$${v}`}
              />
              <Tooltip
                cursor={{ stroke: "rgba(255,255,255,0.1)", strokeWidth: 1 }}
                contentStyle={{
                  background: "rgba(10, 12, 20, 0.95)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 12,
                  fontSize: 12,
                  boxShadow: "0 10px 40px rgba(0,0,0,0.6)"
                }}
                labelStyle={{ color: "rgba(255,255,255,0.6)", marginBottom: 4 }}
                formatter={(v: number) => [formatCurrency(v), "Spend"]}
              />
              <Area
                type="monotone"
                dataKey="spend"
                stroke="hsl(226 100% 64%)"
                strokeWidth={2}
                fill="url(#spend-grad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
