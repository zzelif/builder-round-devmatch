// app/global-not-found.tsx
/* eslint-disable @next/next/no-html-link-for-pages */

import "./globals.css";
import { Geist, Geist_Mono } from "next/font/google";
import type { Metadata } from "next";
import { HomeIcon, SearchIcon } from "lucide-react";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import TopNav from "@/components/navbar/TopNavClient";
import { auth } from "@/auth";
import Providers from "@/components/Providers";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "404 - Page Not Found",
  description: "The page you are looking for does not exist.",
};

export default async function GlobalNotFound() {
  const session = await auth();
  const profileComplete = session?.user?.profileComplete ?? false;

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="min-h-screen bg-background flex flex-col">
          {/* Header */}
          <Providers session={session} profileComplete={profileComplete}>
            <TopNav session={session} />

            {/* Main Content */}
            <main className="flex-1 flex items-center justify-center px-4 py-20">
              <Empty className="w-full max-w-md">
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <div className="text-6xl">🔍</div>
                  </EmptyMedia>
                  <EmptyTitle>404 - Page Not Found</EmptyTitle>
                  <EmptyDescription>
                    The page you&apos;re looking for doesn&apos;t exist. It
                    might have been moved or deleted. Let&apos;s get you back on
                    track!
                  </EmptyDescription>
                </EmptyHeader>
                <EmptyContent className="space-y-4">
                  <div className="flex gap-2 flex-col sm:flex-row">
                    <a
                      href="/"
                      className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2 flex-1"
                    >
                      <HomeIcon className="w-4 h-4" />
                      Back to Home
                    </a>
                    <a
                      href="/networks"
                      className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 flex-1"
                    >
                      <SearchIcon className="w-4 h-4" />
                      Explore
                    </a>
                  </div>
                </EmptyContent>
              </Empty>
            </main>

            {/* Footer */}
            <Footer />
          </Providers>
        </div>
      </body>
    </html>
  );
}
