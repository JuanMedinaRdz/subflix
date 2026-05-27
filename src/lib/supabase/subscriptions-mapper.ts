import type { BillingCycle, Subscription, SubscriptionStatus } from "@/types";

/**
 * DB row shape (snake_case) returned by Supabase.
 */
export interface SubscriptionRow {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  category: string;
  price: number | string;
  currency: string;
  billing_cycle: string;
  next_renewal: string;
  started_at: string;
  status: string;
  color: string;
  logo: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export function rowToSubscription(row: SubscriptionRow): Subscription {
  return {
    id: row.id,
    name: row.name,
    description: row.description ?? undefined,
    category: row.category as Subscription["category"],
    price: typeof row.price === "string" ? parseFloat(row.price) : row.price,
    currency: row.currency,
    billingCycle: row.billing_cycle as BillingCycle,
    nextRenewal: row.next_renewal,
    startedAt: row.started_at,
    status: row.status as SubscriptionStatus,
    color: row.color,
    logo: row.logo ?? undefined,
    notes: row.notes ?? undefined
  };
}

export function subscriptionToInsert(sub: Omit<Subscription, "id">, userId: string) {
  return {
    user_id: userId,
    name: sub.name,
    description: sub.description ?? null,
    category: sub.category,
    price: sub.price,
    currency: sub.currency,
    billing_cycle: sub.billingCycle,
    next_renewal: sub.nextRenewal,
    started_at: sub.startedAt,
    status: sub.status,
    color: sub.color,
    logo: sub.logo ?? null,
    notes: sub.notes ?? null
  };
}

export function subscriptionToUpdate(patch: Partial<Subscription>) {
  const out: Record<string, unknown> = {};
  if (patch.name !== undefined) out.name = patch.name;
  if (patch.description !== undefined) out.description = patch.description ?? null;
  if (patch.category !== undefined) out.category = patch.category;
  if (patch.price !== undefined) out.price = patch.price;
  if (patch.currency !== undefined) out.currency = patch.currency;
  if (patch.billingCycle !== undefined) out.billing_cycle = patch.billingCycle;
  if (patch.nextRenewal !== undefined) out.next_renewal = patch.nextRenewal;
  if (patch.startedAt !== undefined) out.started_at = patch.startedAt;
  if (patch.status !== undefined) out.status = patch.status;
  if (patch.color !== undefined) out.color = patch.color;
  if (patch.logo !== undefined) out.logo = patch.logo ?? null;
  if (patch.notes !== undefined) out.notes = patch.notes ?? null;
  return out;
}
