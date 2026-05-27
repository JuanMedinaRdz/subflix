"use client";
import { useCallback, useEffect, useState } from "react";
import { seedSubscriptions } from "@/lib/mock-data";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import {
  rowToSubscription,
  subscriptionToInsert,
  subscriptionToUpdate,
  type SubscriptionRow
} from "@/lib/supabase/subscriptions-mapper";
import { useAuth } from "@/hooks/use-auth";
import type { Subscription } from "@/types";

const STORAGE_KEY = "subflix:subscriptions:v1";

function loadLocal(): Subscription[] {
  if (typeof window === "undefined") return seedSubscriptions;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return seedSubscriptions;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return seedSubscriptions;
    return parsed as Subscription[];
  } catch {
    return seedSubscriptions;
  }
}

function persistLocal(next: Subscription[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

export function useSubscriptions() {
  const { user, loading: authLoading } = useAuth();
  const supabase = getSupabaseBrowserClient();
  const usingSupabase = !!user && !!supabase;

  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Load on mount or when auth state flips
  useEffect(() => {
    if (authLoading) return;
    let cancelled = false;

    async function load() {
      if (usingSupabase && supabase && user) {
        const { data, error } = await supabase
          .from("subscriptions")
          .select("*")
          .order("next_renewal", { ascending: true });
        if (cancelled) return;
        if (error) {
          console.error("Failed to load subscriptions", error);
          setSubscriptions([]);
        } else {
          setSubscriptions((data as SubscriptionRow[]).map(rowToSubscription));
        }
        setHydrated(true);
      } else {
        setSubscriptions(loadLocal());
        setHydrated(true);
      }
    }

    setHydrated(false);
    load();
    return () => {
      cancelled = true;
    };
  }, [authLoading, usingSupabase, supabase, user]);

  const create = useCallback(
    async (sub: Omit<Subscription, "id">) => {
      if (usingSupabase && supabase && user) {
        const { data, error } = await supabase
          .from("subscriptions")
          .insert(subscriptionToInsert(sub, user.id))
          .select("*")
          .single();
        if (error || !data) {
          console.error("Failed to create subscription", error);
          return;
        }
        const created = rowToSubscription(data as SubscriptionRow);
        setSubscriptions((prev) => [...prev, created]);
      } else {
        setSubscriptions((prev) => {
          const next = [
            ...prev,
            { ...sub, id: `sub_${Math.random().toString(36).slice(2, 10)}` }
          ];
          persistLocal(next);
          return next;
        });
      }
    },
    [usingSupabase, supabase, user]
  );

  const update = useCallback(
    async (id: string, patch: Partial<Subscription>) => {
      if (usingSupabase && supabase) {
        // Optimistic update
        setSubscriptions((prev) =>
          prev.map((s) => (s.id === id ? { ...s, ...patch } : s))
        );
        const { error } = await supabase
          .from("subscriptions")
          .update(subscriptionToUpdate(patch))
          .eq("id", id);
        if (error) console.error("Failed to update subscription", error);
      } else {
        setSubscriptions((prev) => {
          const next = prev.map((s) => (s.id === id ? { ...s, ...patch } : s));
          persistLocal(next);
          return next;
        });
      }
    },
    [usingSupabase, supabase]
  );

  const remove = useCallback(
    async (id: string) => {
      if (usingSupabase && supabase) {
        setSubscriptions((prev) => prev.filter((s) => s.id !== id));
        const { error } = await supabase.from("subscriptions").delete().eq("id", id);
        if (error) console.error("Failed to delete subscription", error);
      } else {
        setSubscriptions((prev) => {
          const next = prev.filter((s) => s.id !== id);
          persistLocal(next);
          return next;
        });
      }
    },
    [usingSupabase, supabase]
  );

  const reset = useCallback(async () => {
    if (usingSupabase && supabase && user) {
      // Wipe my rows, then re-insert the seed
      await supabase.from("subscriptions").delete().eq("user_id", user.id);
      const rows = seedSubscriptions.map((s) => {
        const { id: _ignored, ...rest } = s;
        return subscriptionToInsert(rest, user.id);
      });
      const { data, error } = await supabase
        .from("subscriptions")
        .insert(rows)
        .select("*");
      if (error || !data) {
        console.error("Failed to reset subscriptions", error);
        setSubscriptions([]);
      } else {
        setSubscriptions((data as SubscriptionRow[]).map(rowToSubscription));
      }
    } else {
      persistLocal(seedSubscriptions);
      setSubscriptions(seedSubscriptions);
    }
  }, [usingSupabase, supabase, user]);

  return {
    subscriptions,
    hydrated,
    create,
    update,
    remove,
    reset,
    syncing: usingSupabase
  };
}
