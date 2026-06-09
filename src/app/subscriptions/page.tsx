"use client";
import { useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Plus, Search, RotateCcw } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { SubscriptionCard } from "@/components/subscriptions/subscription-card";
import { SubscriptionFormDialog } from "@/components/subscriptions/subscription-form";
import { useSubscriptions } from "@/hooks/use-subscriptions";
import type { Category, Subscription } from "@/types";

const categories: ("All" | Category)[] = [
  "All",
  "Entertainment",
  "Productivity",
  "Music",
  "Cloud",
  "Developer",
  "AI",
  "News",
  "Fitness",
  "Other"
];

type Mode = { kind: "create" } | { kind: "edit"; sub: Subscription };

export default function SubscriptionsPage() {
  const { subscriptions, hydrated, create, update, remove, reset } =
    useSubscriptions();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<(typeof categories)[number]>("All");
  const [mode, setMode] = useState<Mode | null>(null);
  const [open, setOpen] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return subscriptions.filter((s) => {
      if (category !== "All" && s.category !== category) return false;
      if (q && !s.name.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [subscriptions, query, category]);

  return (
    <AppShell
      title="Subscriptions"
      subtitle={`${subscriptions.length} tracked subscriptions`}
    >
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 gap-2 md:max-w-2xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name..."
              className="pl-9"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              data-testid="sub-search"
            />
          </div>
          <Select
            value={category}
            onValueChange={(v) => setCategory(v as (typeof categories)[number])}
          >
            <SelectTrigger className="w-32 shrink-0 sm:w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={reset}
            title="Reset to demo data"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Reset demo
          </Button>
          <Button
            className="flex-1 md:flex-none"
            onClick={() => {
              setMode({ kind: "create" });
              setOpen(true);
            }}
            data-testid="add-subscription"
          >
            <Plus className="h-4 w-4" /> New subscription
          </Button>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <AnimatePresence>
          {hydrated &&
            filtered.map((s) => (
              <SubscriptionCard
                key={s.id}
                sub={s}
                onEdit={() => {
                  setMode({ kind: "edit", sub: s });
                  setOpen(true);
                }}
                onDelete={() => remove(s.id)}
                onToggle={() =>
                  update(s.id, {
                    status: s.status === "paused" ? "active" : "paused"
                  })
                }
              />
            ))}
        </AnimatePresence>
      </div>

      {hydrated && filtered.length === 0 && (
        <div className="mt-12 flex flex-col items-center justify-center rounded-2xl glass-subtle p-12 text-center">
          <p className="font-medium">No subscriptions found</p>
          <p className="text-sm text-muted-foreground mt-1">
            Try adjusting your filters or add a new one.
          </p>
        </div>
      )}

      <SubscriptionFormDialog
        open={open}
        onOpenChange={setOpen}
        mode={mode}
        onSubmit={(data) => {
          if (mode?.kind === "edit") {
            const { id, ...patch } = data;
            if (id) update(id, patch);
          } else {
            const { id: _ignore, ...rest } = data;
            create(rest);
          }
        }}
      />
    </AppShell>
  );
}
