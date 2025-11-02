// src/components/navbar/TopNavClient.tsx
"use client";

import { MessageCircle, Users, Sparkles } from "lucide-react";
import { usePathname } from "next/navigation";
import { Session } from "next-auth";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "@/components/navbar/logo";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Link from "next/link";
import Menu from "./Menu";
import ThemeSwitch from "../ThemeToggle";
// import { Badge } from "@/components/ui/badge";

const navigationLinks = [
  { href: "/networks", label: "Discover", icon: Sparkles },
  { href: "/messages", label: "Messages", icon: MessageCircle },
  { href: "/lists", label: "Connections", icon: Users },
];

interface TopNavClientProps {
  session: Session | null;
}

export default function TopNav({ session }: TopNavClientProps) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full glass border-b border-border/40 backdrop-blur-xl supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Left Section - Logo & Mobile Menu */}
          <div className="flex items-center gap-4">
            {/* Mobile Menu */}
            {session && (
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden hover:bg-primary/10"
                  >
                    <svg
                      width={20}
                      height={20}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M4 12L20 12" />
                      <path d="M4 6H20" />
                      <path d="M4 18H20" />
                    </svg>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-72">
                  <SheetHeader>
                    <SheetTitle className="text-left">
                      <Logo />
                    </SheetTitle>
                  </SheetHeader>
                  <nav className="mt-8 flex flex-col gap-2">
                    {navigationLinks.map((link) => {
                      const Icon = link.icon;
                      const isActive = pathname === link.href;
                      return (
                        <Link
                          key={link.href}
                          href={link.href}
                          className={`
                            flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                            ${
                              isActive
                                ? "bg-primary/10 text-primary font-semibold"
                                : "text-muted-foreground hover:bg-accent hover:text-foreground"
                            }
                          `}
                        >
                          <Icon className="w-5 h-5" />
                          <span>{link.label}</span>
                        </Link>
                      );
                    })}
                  </nav>
                </SheetContent>
              </Sheet>
            )}

            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2 text-primary hover:text-primary/90 transition-colors group"
            >
              <motion.div
                whileHover={{ rotate: 10, scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <Logo />
              </motion.div>
              <span className="font-bold text-lg hidden sm:inline-block text-foreground group-hover:text-primary transition-colors">
                DevMatch
              </span>
            </Link>
          </div>

          {/* Center Section - Desktop Navigation */}
          {session && (
            <nav className="hidden md:flex items-center gap-1">
              {navigationLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="relative px-4 py-2 rounded-lg transition-all duration-200"
                  >
                    <motion.div
                      className="flex items-center gap-2"
                      whileHover={{ y: -2 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <Icon
                        className={`w-4 h-4 transition-colors ${
                          isActive ? "text-primary" : "text-muted-foreground"
                        }`}
                      />
                      <span
                        className={`font-medium text-sm transition-colors ${
                          isActive
                            ? "text-primary"
                            : "text-foreground hover:text-primary"
                        }`}
                      >
                        {link.label}
                      </span>
                    </motion.div>

                    {/* Active indicator */}
                    <AnimatePresence>
                      {isActive && (
                        <motion.div
                          layoutId="active-pill"
                          className="absolute inset-0 bg-primary/10 rounded-lg -z-10"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 30,
                          }}
                        />
                      )}
                    </AnimatePresence>
                  </Link>
                );
              })}
            </nav>
          )}

          {/* Right Section - Auth Buttons / User Menu */}
          <div className="flex items-center gap-2">
            {session?.user ? (
              <Menu user={session.user} />
            ) : (
              <div className="flex items-center gap-2">
                <ThemeSwitch />
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="text-sm hover:bg-primary/10"
                >
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button
                  asChild
                  size="sm"
                  className="text-sm gradient-primary shadow-lg hover:shadow-xl transition-shadow"
                >
                  <Link href="/register">
                    <Sparkles className="w-4 h-4 mr-1" />
                    Get Started
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
