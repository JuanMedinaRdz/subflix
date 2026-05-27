"use client";
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Mail, Sparkles, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";

export default function LoginPage() {
  const { signInWithMagicLink, configured } = useAuth();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("sending");
    setError(null);
    const { error } = await signInWithMagicLink(email.trim());
    if (error) {
      setError(error);
      setStatus("error");
    } else {
      setStatus("sent");
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-6 overflow-hidden">
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-30" />
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-brand-500/20 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-purple-500/20 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-brand shadow-lg shadow-brand-500/30">
            <Sparkles className="h-5 w-5 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-xl font-semibold tracking-tight">Subflix</span>
        </div>

        <div className="rounded-2xl glass p-8">
          {status === "sent" ? (
            <div className="flex flex-col items-center text-center gap-3 py-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success/15 text-success">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <h1 className="text-xl font-semibold">Check your inbox</h1>
              <p className="text-sm text-muted-foreground">
                We sent a magic link to <span className="text-foreground font-medium">{email}</span>.
                Click it to sign in.
              </p>
              <button
                onClick={() => {
                  setStatus("idle");
                  setEmail("");
                }}
                className="mt-2 text-xs text-muted-foreground underline hover:text-foreground"
              >
                Use a different email
              </button>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-semibold tracking-tight">Sign in</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Get a one-time magic link by email — no password needed.
              </p>

              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      autoComplete="email"
                      required
                      placeholder="you@example.com"
                      className="pl-9"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={!configured || status === "sending"}
                      data-testid="login-email"
                    />
                  </div>
                </div>

                {!configured && (
                  <p className="text-xs text-warning">
                    Auth is not configured on this deploy. Try the{" "}
                    <Link href="/" className="underline">
                      demo
                    </Link>{" "}
                    instead — all features work locally with seed data.
                  </p>
                )}

                {error && (
                  <p className="text-xs text-destructive" role="alert">
                    {error}
                  </p>
                )}

                <Button
                  type="submit"
                  className="w-full"
                  disabled={!configured || status === "sending"}
                  data-testid="login-submit"
                >
                  {status === "sending" ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Sending link...
                    </>
                  ) : (
                    <>
                      Send magic link <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            </>
          )}
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Just browsing?{" "}
          <Link href="/" className="text-foreground underline">
            Try the demo without signing in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
