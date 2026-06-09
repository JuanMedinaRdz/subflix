"use client";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import type { AuthChangeEvent, Session, User } from "@supabase/supabase-js";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

type AuthState = {
  user: User | null;
  loading: boolean;
  configured: boolean;
  /** Sends a 6-digit one-time code to the given email. */
  sendOtp: (email: string) => Promise<{ error: string | null }>;
  /** Verifies the 6-digit code and opens a session on success. */
  verifyOtp: (email: string, token: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const supabase = getSupabaseBrowserClient();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    supabase.auth.getUser().then(({ data }: { data: { user: User | null } }) => {
      if (cancelled) return;
      setUser(data.user);
      setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange(
      (_event: AuthChangeEvent, session: Session | null) => {
        setUser(session?.user ?? null);
      }
    );
    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, [supabase]);

  const value = useMemo<AuthState>(
    () => ({
      user,
      loading,
      configured: isSupabaseConfigured,
      async sendOtp(email) {
        if (!supabase) return { error: "Auth is not configured." };
        // No `emailRedirectTo`: this makes Supabase deliver a numeric code
        // (the `{{ .Token }}` template) instead of a magic link.
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: { shouldCreateUser: true }
        });
        return { error: error?.message ?? null };
      },
      async verifyOtp(email, token) {
        if (!supabase) return { error: "Auth is not configured." };
        const { error } = await supabase.auth.verifyOtp({
          email,
          token,
          type: "email"
        });
        return { error: error?.message ?? null };
      },
      async signOut() {
        if (!supabase) return;
        await supabase.auth.signOut();
        setUser(null);
      }
    }),
    [supabase, user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
