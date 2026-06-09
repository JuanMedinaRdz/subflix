"use client";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import type { BillingCycle, Category, Subscription, SubscriptionStatus } from "@/types";

const categories: Category[] = [
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

const cycles: BillingCycle[] = ["weekly", "monthly", "quarterly", "yearly"];

type Mode = { kind: "create" } | { kind: "edit"; sub: Subscription };

export function SubscriptionFormDialog({
  open,
  onOpenChange,
  mode,
  onSubmit
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  mode: Mode | null;
  onSubmit: (data: Omit<Subscription, "id"> & { id?: string }) => void;
}) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "Entertainment" as Category,
    price: 0,
    billingCycle: "monthly" as BillingCycle,
    nextRenewal: new Date().toISOString().slice(0, 10),
    color: "#7c5cff",
    logo: "",
    status: "active" as SubscriptionStatus
  });

  useEffect(() => {
    if (mode?.kind === "edit") {
      const s = mode.sub;
      setForm({
        name: s.name,
        description: s.description ?? "",
        category: s.category,
        price: s.price,
        billingCycle: s.billingCycle,
        nextRenewal: s.nextRenewal.slice(0, 10),
        color: s.color,
        logo: s.logo ?? "",
        status: s.status
      });
    } else if (mode?.kind === "create") {
      setForm({
        name: "",
        description: "",
        category: "Entertainment",
        price: 0,
        billingCycle: "monthly",
        nextRenewal: new Date().toISOString().slice(0, 10),
        color: "#7c5cff",
        logo: "",
        status: "active"
      });
    }
  }, [mode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    onSubmit({
      ...(mode?.kind === "edit" ? { id: mode.sub.id, startedAt: mode.sub.startedAt } : { startedAt: new Date().toISOString() }),
      name: form.name.trim(),
      description: form.description.trim() || undefined,
      category: form.category,
      price: Number(form.price) || 0,
      currency: "MXN",
      billingCycle: form.billingCycle,
      nextRenewal: new Date(form.nextRenewal).toISOString(),
      color: form.color,
      logo: form.logo.trim() || undefined,
      status: form.status
    } as Subscription & { id?: string });
    onOpenChange(false);
  };

  const isEdit = mode?.kind === "edit";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit subscription" : "New subscription"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update the details of this subscription."
              : "Track a new digital subscription in your portfolio."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4" data-testid="subscription-form">
          <div className="grid gap-1.5">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              required
              autoFocus
              placeholder="Netflix, Spotify, ..."
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              data-testid="form-name"
            />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              placeholder="Family plan, 2TB storage, ..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-1.5">
              <Label htmlFor="price">Price (MXN)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min={0}
                required
                value={form.price}
                onChange={(e) =>
                  setForm({ ...form, price: parseFloat(e.target.value) || 0 })
                }
                data-testid="form-price"
              />
            </div>
            <div className="grid gap-1.5">
              <Label>Billing cycle</Label>
              <Select
                value={form.billingCycle}
                onValueChange={(v) =>
                  setForm({ ...form, billingCycle: v as BillingCycle })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {cycles.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c[0].toUpperCase() + c.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-1.5">
              <Label>Category</Label>
              <Select
                value={form.category}
                onValueChange={(v) => setForm({ ...form, category: v as Category })}
              >
                <SelectTrigger>
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
            <div className="grid gap-1.5">
              <Label htmlFor="renewal">Next renewal</Label>
              <Input
                id="renewal"
                type="date"
                required
                value={form.nextRenewal}
                onChange={(e) => setForm({ ...form, nextRenewal: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-1.5">
              <Label htmlFor="logo">Logo slug (Simple Icons)</Label>
              <Input
                id="logo"
                placeholder="netflix, spotify, github"
                value={form.logo}
                onChange={(e) => setForm({ ...form, logo: e.target.value })}
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="color">Accent color</Label>
              <div className="flex gap-2">
                <Input
                  id="color"
                  type="color"
                  className="h-10 w-14 p-1"
                  value={form.color}
                  onChange={(e) => setForm({ ...form, color: e.target.value })}
                />
                <Input
                  className="flex-1"
                  value={form.color}
                  onChange={(e) => setForm({ ...form, color: e.target.value })}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              type="button"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" data-testid="form-submit">
              {isEdit ? "Save changes" : "Create subscription"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
