// src/app/networks/MemberSidebar.tsx
"use client";

import { Member } from "@/generated/prisma";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  User,
  Camera,
  MessageCircle,
  MapPin,
  Calendar,
  Lock,
} from "lucide-react";
import { motion } from "framer-motion";
import { usePresenceStore } from "@/hooks/usePresenceStore";

type Props = {
  member: Member;
  navLinks: { name: string; href: string; locked?: boolean }[];
  hasMatch: boolean;
};

const iconMap = {
  Profile: User,
  Photos: Camera,
  Message: MessageCircle,
  "Edit Profile": User,
  "Update Photos": Camera,
};

export default function MemberSidebar({ member, navLinks, hasMatch }: Props) {
  const pathname = usePathname();
  const isOwnProfile = pathname.startsWith("/networks/edit");
  const isOnline = usePresenceStore((state) =>
    state.onlineMembers.includes(member.userId)
  );

  return (
    <Card className="w-full overflow-hidden shadow-xl">
      {/* Profile Header */}
      <div className="relative">
        <div className="h-24 gradient-primary"></div>
        <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
          {member.image ? (
            <div className="relative">
              <Image
                height={96}
                width={96}
                src={member.image}
                alt={member.name}
                className="rounded-full aspect-square object-cover border-4 border-card shadow-xl ring-2 ring-primary/20"
                unoptimized
                priority
              />
              {/* Online Status */}
              {!isOwnProfile && (
                <div
                  className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-3 border-card shadow-md transition-colors ${
                    isOnline ? "bg-success" : "bg-muted-foreground/30"
                  }`}
                  title={isOnline ? "Online" : "Offline"}
                />
              )}
            </div>
          ) : (
            <div className="w-24 h-24 rounded-full bg-linear-to-br from-primary/20 to-secondary/20 flex items-center justify-center border-4 border-card shadow-xl ring-2 ring-primary/20">
              <User className="w-10 h-10 text-primary" />
            </div>
          )}
        </div>
      </div>

      <CardContent className="pt-16 pb-6 px-6">
        {/* Member Info */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-foreground mb-1">
            {member.name}
          </h2>
          <p className="text-lg text-muted-foreground mb-3">
            {member.age} years old
          </p>

          {/* Developer Badge */}
          {/* <Badge className="bg-primary text-primary-foreground mb-4">
            Full Stack Developer
          </Badge> */}

          {/* Match Badge */}
          {hasMatch && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="mb-4"
            >
              <Badge className="bg-success text-success-foreground shadow-lg">
                Mutual Match
              </Badge>
            </motion.div>
          )}

          {/* Quick Stats */}
          <div className="flex justify-center space-x-4 text-sm text-muted-foreground mb-4">
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-1" />
              {member.city}, {member.country}
            </div>
            <div className="flex items-center justify-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>
                Joined{" "}
                {new Date(member.created).toLocaleDateString("en-US", {
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-2 mb-6">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            const isLocked = link.locked ?? false;
            const Icon = iconMap[link.name as keyof typeof iconMap] || User;

            if (isLocked) {
              return (
                <div
                  key={link.name}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-muted text-muted-foreground cursor-not-allowed"
                  title="Match required to unlock"
                >
                  <Lock className="w-4 h-4" />
                  <span className="text-sm font-medium">{link.name}</span>
                  <Lock className="w-3.5 h-3.5 ml-auto" />
                </div>
              );
            }

            return (
              <Link
                href={link.href}
                key={link.name}
                className={`
                  flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200
                  ${
                    isActive
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-foreground hover:bg-accent hover:text-accent-foreground"
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{link.name}</span>
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 bg-primary rounded-full"></div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Match Required Message */}
        {!isOwnProfile && !hasMatch && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 bg-warning/10 border border-warning/20 rounded-lg"
          >
            <p className="text-sm text-warning text-center font-medium">
              Like each other to unlock messaging
            </p>
          </motion.div>
        )}

        {/* Back Button */}
        <Button asChild variant="outline" className="w-full" size="sm">
          <Link href="/networks" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Discovery
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
