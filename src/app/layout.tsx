// src\app\layout.tsx

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import TopNav from "@/components/navbar/TopNavClient";
import Providers from "@/components/Providers";
import { auth } from "@/auth";
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
  title: "DEVMatch",
  description:
    "Connect with fellow developers who share your passion for code, innovation, and building amazing things together.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  const profileComplete = session?.user?.profileComplete ?? false;
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers session={session} profileComplete={profileComplete}>
          <TopNav session={session} />
          <main className="mx-auto">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
