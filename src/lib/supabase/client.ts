"use client";
import { createBrowserClient } from "@supabase/ssr";
import { SUPABASE_ANON_KEY, SUPABASE_URL, isSupabaseConfigured } from "./config";

let browserClient: ReturnType<typeof createBrowserClient> | null = null;
let creationFailed = false;

export function getSupabaseBrowserClient() {
  if (!isSupabaseConfigured || creationFailed) return null;
  if (browserClient) return browserClient;
  try {
    browserClient = createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    return browserClient;
  } catch (err) {
    // Bad env var values — degrade to demo mode instead of crashing the build.
    if (typeof console !== "undefined") {
      console.error("Failed to create Supabase client:", err);
    }
    creationFailed = true;
    return null;
  }
}
