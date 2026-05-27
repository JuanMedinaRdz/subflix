"use client";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";

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
    <div className="relative flex min-h-screen">
      <div className="pointer-events-none fixed inset-0 grid-bg opacity-30" />
      <Sidebar />
      <main className="relative flex-1 min-w-0 flex flex-col">
        <Topbar title={title} subtitle={subtitle} />
        <div className="flex-1 p-6 lg:p-8 animate-fade-in">{children}</div>
      </main>
    </div>
  );
}
