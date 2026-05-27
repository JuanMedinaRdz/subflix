"use client";
import { useEffect, useState, useCallback } from "react";
import { seedSubscriptions } from "@/lib/mock-data";
import type { Subscription } from "@/types";

const STORAGE_KEY = "subflix:subscriptions:v1";

function load(): Subscription[] {
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

function persist(next: Subscription[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

export function useSubscriptions() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setSubscriptions(load());
    setHydrated(true);
  }, []);

  const create = useCallback((sub: Omit<Subscription, "id">) => {
    setSubscriptions((prev) => {
      const next = [
        ...prev,
        { ...sub, id: `sub_${Math.random().toString(36).slice(2, 10)}` }
      ];
      persist(next);
      return next;
    });
  }, []);

  const update = useCallback((id: string, patch: Partial<Subscription>) => {
    setSubscriptions((prev) => {
      const next = prev.map((s) => (s.id === id ? { ...s, ...patch } : s));
      persist(next);
      return next;
    });
  }, []);

  const remove = useCallback((id: string) => {
    setSubscriptions((prev) => {
      const next = prev.filter((s) => s.id !== id);
      persist(next);
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    persist(seedSubscriptions);
    setSubscriptions(seedSubscriptions);
  }, []);

  return { subscriptions, hydrated, create, update, remove, reset };
}
