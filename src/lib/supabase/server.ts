import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { SUPABASE_ANON_KEY, SUPABASE_URL, isSupabaseConfigured } from "./config";

export async function getSupabaseServerClient() {
  if (!isSupabaseConfigured) return null;
  try {
    const cookieStore = await cookies();
    return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from a Server Component — the response is already flushed.
            // Middleware handles refresh in that case, so it's safe to ignore.
          }
        }
      }
    });
  } catch (err) {
    console.error("Failed to create Supabase server client:", err);
    return null;
  }
}
