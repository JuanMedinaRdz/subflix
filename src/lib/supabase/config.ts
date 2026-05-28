const rawUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").trim();
const rawKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "").trim();

function isValidHttpUrl(value: string): boolean {
  if (!value) return false;
  try {
    const u = new URL(value);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

export const SUPABASE_URL = rawUrl;
export const SUPABASE_ANON_KEY = rawKey;

/**
 * `true` when both env vars are present AND the URL is a valid http(s) URL.
 * The strict URL check prevents `createClient` from throwing during build
 * if someone pasted a half-baked value into Vercel's env vars.
 *
 * When `false`, the app silently falls back to the localStorage demo mode.
 */
export const isSupabaseConfigured =
  isValidHttpUrl(rawUrl) && rawKey.length > 20;
