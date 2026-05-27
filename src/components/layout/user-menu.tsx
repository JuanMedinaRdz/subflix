"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogIn, LogOut, Mail, Cloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/use-auth";

export function UserMenu() {
  const { user, loading, configured, signOut } = useAuth();
  const router = useRouter();

  if (loading) {
    return <div className="h-9 w-9 rounded-full bg-muted animate-pulse" />;
  }

  if (!user) {
    return (
      <Button
        asChild
        variant="secondary"
        size="sm"
        className="bg-white/10 border-white/10 hover:bg-white/20 text-white"
      >
        <Link href="/login" data-testid="topbar-signin">
          <LogIn className="h-3.5 w-3.5" />
          {configured ? "Sign in" : "Demo mode"}
        </Link>
      </Button>
    );
  }

  const initial =
    user.email?.[0]?.toUpperCase() ?? user.user_metadata?.name?.[0] ?? "U";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          aria-label="Account menu"
          data-testid="topbar-user"
          className="h-9 w-9 rounded-full gradient-brand flex items-center justify-center text-xs font-semibold text-white ring-2 ring-background hover:ring-primary/40 transition"
        >
          {initial}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[220px]">
        <div className="px-2 py-2">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
            Signed in as
          </p>
          <p className="text-sm font-medium truncate flex items-center gap-1.5 mt-0.5">
            <Mail className="h-3 w-3 text-muted-foreground" />
            {user.email}
          </p>
          <p className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1">
            <Cloud className="h-3 w-3" /> Synced via Supabase
          </p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={async () => {
            await signOut();
            router.push("/");
          }}
          data-testid="topbar-signout"
        >
          <LogOut className="h-3.5 w-3.5" /> Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
