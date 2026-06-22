import type { Metadata } from "next";
import { Suspense } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { AuthNav } from "@/components/AuthNav";

// Font optimization via next/font (self-hosted, no layout shift).
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

// Metadata API: title template applies a suffix to every page title.
export const metadata: Metadata = {
  title: {
    default: "The Next Blog",
    template: "%s · The Next Blog",
  },
  description:
    "A small blog built to exercise Next.js 16: Cache Components, refined cache APIs, proxy.ts, App Router, React 19 hooks, and MCP DevTools.",
};

export default function RootLayout({
  children,
  modal,
}: Readonly<{ children: React.ReactNode; modal: React.ReactNode }>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <header className="border-b border-black/10 dark:border-white/15">
          <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
            <Link href="/" className="text-lg font-bold tracking-tight">
              The Next Blog
            </Link>
            <nav className="flex items-center gap-4 text-sm">
              <Link href="/" className="hover:underline">
                Home
              </Link>
              <Link href="/admin" className="hover:underline">
                Admin
              </Link>
              {/* Auth state is request-time data; isolate it in Suspense so it
                  doesn't block the static shell under Cache Components. */}
              <Suspense fallback={<span className="text-foreground/40">…</span>}>
                <AuthNav />
              </Suspense>
            </nav>
          </div>
        </header>

        <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-8">
          {children}
        </main>

        {/* Parallel @modal slot filled by the intercepting route when a post
            link is clicked from within the app; default.tsx renders null. */}
        {modal}

        <footer className="border-t border-black/10 px-6 py-6 text-center text-xs text-foreground/50 dark:border-white/15">
          Built with Next.js 16 · React 19 · Turbopack
        </footer>
      </body>
    </html>
  );
}
