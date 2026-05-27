import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Subflix — Subscription Analytics Platform",
  description:
    "Premium dashboard to monitor, analyze and control your digital subscriptions.",
  icons: { icon: "/favicon.svg" }
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="font-sans">{children}</body>
    </html>
  );
}
