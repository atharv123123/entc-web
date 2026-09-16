import type { ReactNode } from "react";
import "./globals.css";

import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

export const metadata = {
  title: "ENTC Fix — Department Portal",
  description:
    "ENTC Department portal for announcements, events, complaints, feedback, permissions, and placement updates.",
};

export const dynamic = "force-dynamic";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-dvh bg-slate-50 text-slate-900 antialiased">
        <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(900px_circle_at_0%_0%,rgba(99,102,241,0.18),transparent_60%),radial-gradient(900px_circle_at_100%_0%,rgba(236,72,153,0.16),transparent_60%),radial-gradient(900px_circle_at_50%_100%,rgba(14,165,233,0.12),transparent_60%)]" />
        <SiteHeader />
        <main className="mx-auto w-full max-w-6xl px-4 py-10">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
