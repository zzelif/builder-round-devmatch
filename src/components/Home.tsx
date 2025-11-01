"use client";

import { Button } from "@/components/ui/button";
import { Code2, Heart, Users, Zap, Compass, UserPen } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Session } from "next-auth";

interface HomeProps {
  session: Session | null;
}

export default function Home({ session }: HomeProps) {
  const isSignedIn = !!session?.user;

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] text-center">
      <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
        {/* Hero Section */}
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary/20"
          >
            <Code2 className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">
              For Developers, By Developers
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-6xl font-bold bg-linear-to-r from-primary via-primary to-success bg-clip-text text-transparent"
          >
            Find Your Perfect Match
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xl text-muted-foreground max-w-2xl mx-auto"
          >
            Connect with fellow developers who share your passion for code,
            innovation, and building amazing things together.
          </motion.p>
        </div>

        {/* CTA Buttons - Different for signed in/out */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex gap-4 justify-center flex-wrap"
        >
          {isSignedIn ? (
            <>
              {/* Signed In CTAs */}
              <motion.div
                whileHover={{
                  scale: 1.05,
                  transition: { duration: 0.2 },
                }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  className="gradient-primary text-lg relative overflow-hidden group"
                  asChild
                >
                  <Link href="/networks" className="flex items-center">
                    <motion.div
                      initial={{ rotate: 0 }}
                      whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                      transition={{
                        duration: 0.5,
                        repeat: Infinity,
                        repeatDelay: 0.5,
                      }}
                    >
                      <Compass className="mr-2 h-5 w-5" />
                    </motion.div>
                    Discover Matches
                    {/* Animated shine effect */}
                    <motion.div
                      className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: "100%" }}
                      transition={{ duration: 0.6 }}
                    />
                  </Link>
                </Button>
              </motion.div>

              <motion.div
                whileHover={{
                  scale: 1.05,
                  transition: { duration: 0.2 },
                }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg border-2 hover:border-primary/50"
                  asChild
                >
                  <Link href="/networks/edit" className="flex items-center">
                    <UserPen className="mr-2 h-5 w-5" />
                    Edit Profile
                  </Link>
                </Button>
              </motion.div>
            </>
          ) : (
            <>
              {/* Signed Out CTAs */}
              <motion.div
                whileHover={{
                  scale: 1.05,
                  transition: { duration: 0.2 },
                }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  className="gradient-primary text-lg relative overflow-hidden group"
                  asChild
                >
                  <Link href="/register" className="flex items-center">
                    <motion.div
                      initial={{ x: 0 }}
                      whileHover={{ x: [0, -4, 0] }}
                      transition={{
                        duration: 0.5,
                        repeat: Infinity,
                        repeatDelay: 0.5,
                      }}
                    >
                      <Heart className="mr-2 h-5 w-5" />
                    </motion.div>
                    Get Started
                    {/* Animated shine effect */}
                    <motion.div
                      className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: "100%" }}
                      transition={{ duration: 0.6 }}
                    />
                  </Link>
                </Button>
              </motion.div>

              <motion.div
                whileHover={{
                  scale: 1.05,
                  transition: { duration: 0.2 },
                }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg border-2 hover:border-primary/50"
                  asChild
                >
                  <Link href="/login">Sign In</Link>
                </Button>
              </motion.div>
            </>
          )}
        </motion.div>

        {/* Feature Grid with Stagger Animation */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                delayChildren: 0.8,
                staggerChildren: 0.15,
              },
            },
          }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16"
        >
          <FeatureCard
            icon={<Code2 className="h-8 w-8" />}
            title="Developer-First"
            description="Built for the tech community with features that matter to developers"
          />
          <FeatureCard
            icon={<Users className="h-8 w-8" />}
            title="Smart Matching"
            description="Connect based on skills, interests, and coding preferences"
          />
          <FeatureCard
            icon={<Zap className="h-8 w-8" />}
            title="Real-Time Chat"
            description="Instant messaging powered by modern tech stack"
          />
        </motion.div>
      </div>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.5,
            ease: "easeOut",
          },
        },
      }}
      whileHover={{
        y: -8,
        transition: { duration: 0.2 },
      }}
      className="glass p-6 rounded-xl border border-border/50 hover:border-primary/50 transition-all group"
    >
      <motion.div
        whileHover={{
          scale: 1.1,
          rotate: [0, -10, 10, -10, 0],
          transition: { duration: 0.5 },
        }}
        className="text-primary mb-4"
      >
        {icon}
      </motion.div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </motion.div>
  );
}
