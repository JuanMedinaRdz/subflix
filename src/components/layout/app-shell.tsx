"use client";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";
import { MobileNav } from "./mobile-nav";

export function AppShell({
  title,
  subtitle,
  children
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-[100dvh]">
      <div className="pointer-events-none fixed inset-0 grid-bg opacity-20" />
      <Sidebar />
      <main className="relative flex min-w-0 flex-1 flex-col">
        <Topbar title={title} subtitle={subtitle} />
        {/* Extra bottom padding on mobile clears the fixed bottom nav. */}
        <div className="flex-1 animate-fade-in p-4 pb-24 sm:p-6 md:pb-8 lg:p-8">
          {children}
        </div>
      </main>
      <MobileNav />
    </div>
  );
}
