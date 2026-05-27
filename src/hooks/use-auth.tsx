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
  signInWithMagicLink: (email: string) => Promise<{ error: string | null }>;
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
      async signInWithMagicLink(email) {
        if (!supabase) return { error: "Auth is not configured." };
        const redirect =
          typeof window !== "undefined"
            ? `${window.location.origin}/auth/callback`
            : undefined;
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: { emailRedirectTo: redirect }
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
