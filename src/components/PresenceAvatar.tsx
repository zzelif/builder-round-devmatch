// src/components/PresenceAvatar.tsx - NO ZUSTAND STORE
"use client";

import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { cn } from "@/lib/utils";

type Props = {
  userId?: string;
  src?: string | null;
  name?: string;
  size?: "sm" | "md" | "lg";
  isOnline?: boolean; // ✅ Accept online status as prop instead of store
};

export default function PresenceAvatar({
  userId,
  src,
  name,
  size = "md",
  isOnline = false, // ✅ Default to offline
}: Props) {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-16 w-16",
  };

  return (
    <div className="relative">
      <Avatar className={cn(sizeClasses[size])}>
        <AvatarImage
          src={src || "/images/user.png"}
          alt={name || "User avatar"}
        />
        <AvatarFallback className="bg-linear-to-br from-indigo-500 to-purple-600 text-white">
          {name ? name.charAt(0).toUpperCase() : "U"}
        </AvatarFallback>
      </Avatar>

      {/* ✅ Simple presence indicator */}
      <span
        className={cn(
          "absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white shadow-sm",
          isOnline ? "bg-green-500" : "bg-gray-400"
        )}
        title={isOnline ? "Online" : "Offline"}
      />
    </div>
  );
}
