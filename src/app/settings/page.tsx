"use client";
import { AppShell } from "@/components/layout/app-shell";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSubscriptions } from "@/hooks/use-subscriptions";

export default function SettingsPage() {
  const { subscriptions, reset } = useSubscriptions();
  return (
    <AppShell title="Settings" subtitle="Customize your Subflix experience">
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Demo data</CardTitle>
            <CardDescription>
              Subflix runs locally using mock data persisted in your browser. Reset
              anytime to restore the original portfolio of {14} subscriptions.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              You currently have {subscriptions.length} subscriptions.
            </span>
            <Button variant="outline" onClick={reset}>
              Reset to demo
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>About Subflix</CardTitle>
            <CardDescription>
              A premium portfolio project showcasing modern frontend, clean
              architecture and QA automation skills.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Built with Next.js, TypeScript, TailwindCSS, Framer Motion and Recharts.
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
