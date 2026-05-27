export type BillingCycle = "monthly" | "yearly" | "weekly" | "quarterly";

export type SubscriptionStatus = "active" | "paused" | "cancelled" | "trial";

export type Category =
  | "Entertainment"
  | "Productivity"
  | "Music"
  | "Cloud"
  | "Developer"
  | "AI"
  | "News"
  | "Fitness"
  | "Other";

export interface Subscription {
  id: string;
  name: string;
  description?: string;
  category: Category;
  price: number;
  currency: string;
  billingCycle: BillingCycle;
  nextRenewal: string; // ISO
  startedAt: string; // ISO
  status: SubscriptionStatus;
  color: string; // hex
  logo?: string; // url or short slug
  notes?: string;
}

export interface CategoryTotal {
  category: Category;
  total: number;
  count: number;
}
