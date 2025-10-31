// src/app/networks/MemberSidebar.tsx
"use client";

import React from "react";
import { Member } from "@prisma/client";
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
} from "lucide-react";

type Props = {
  member: Member;
  navLinks: { name: string; href: string }[];
};

const iconMap = {
  Profile: User,
  Photos: Camera,
  Message: MessageCircle,
};

export default function MemberSidebar({ member, navLinks }: Props) {
  const pathname = usePathname();

  return (
    <Card className="w-full mt-10 overflow-hidden border-0 shadow-xl bg-white dark:bg-slate-900">
      {/* Profile Header */}
      <div className="relative">
        <div className="h-32 bg-linear-to-br from-indigo-500 to-purple-600"></div>
        <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
          {member.image ? (
            <div className="relative">
              <Image
                height={128}
                width={128}
                src={member.image}
                alt="User profile"
                className="rounded-full aspect-square object-cover border-4 border-white dark:border-slate-900 shadow-lg"
              />
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-3 border-white dark:border-slate-900 flex items-center justify-center">
                <div className="w-3 h-3 bg-white rounded-full"></div>
              </div>
            </div>
          ) : (
            <div className="w-32 h-32 rounded-full bg-linear-to-br from-indigo-200 to-purple-200 dark:from-indigo-800 dark:to-purple-800 flex items-center justify-center border-4 border-white dark:border-slate-900 shadow-lg">
              <User className="w-12 h-12 text-indigo-600 dark:text-indigo-400" />
            </div>
          )}
        </div>
      </div>

      <CardContent className="pt-20 pb-6">
        {/* Member Info */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {member.name}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-3">
            {member.age} years old
          </p>

          {/* Developer Badge */}
          <Badge className="bg-indigo-500 text-white border-0 mb-4">
            💻 Full Stack Developer
          </Badge>

          {/* Quick Stats */}
          <div className="flex justify-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-1" />
              {member.city}, {member.country}
            </div>
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              {new Date(member.created).toLocaleDateString("en-US", {
                month: "short",
                year: "numeric",
              })}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-2 mb-6">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = iconMap[link.name as keyof typeof iconMap] || User;

            return (
              <Link
                href={link.href}
                key={link.name}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                  ${
                    isActive
                      ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white"
                  }
                `}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{link.name}</span>
                {isActive && (
                  <div className="ml-auto w-2 h-2 bg-indigo-500 rounded-full"></div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Back Button */}
        <Button
          asChild
          variant="outline"
          className="w-full border-2 hover:bg-gray-50 dark:hover:bg-slate-800"
        >
          <Link href="/networks" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Discovery
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
