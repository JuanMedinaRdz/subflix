import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { AuthProvider } from "@/hooks/use-auth";
import { PwaRegister } from "@/components/pwa-register";

// Display face for headlines: gives the catalogue / cinematic editorial voice.
// UI + numbers stay on Geist for a clean, legible product surface.
const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["600", "700", "800"],
  display: "swap"
});

export const metadata: Metadata = {
  title: "Subflix - Subscription Analytics Platform",
  description:
    "Premium dashboard to monitor, analyze and control your digital subscriptions.",
  applicationName: "Subflix",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Subflix"
  },
  icons: {
    icon: "/favicon.svg",
    apple: "/icon.svg"
  }
};

export const viewport: Viewport = {
  themeColor: "#0a0a0f",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`dark ${GeistSans.variable} ${GeistMono.variable} ${display.variable}`}
      suppressHydrationWarning
    >
      <body className="font-sans">
        <AuthProvider>{children}</AuthProvider>
        <PwaRegister />
      </body>
    </html>
  );
}
