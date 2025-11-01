// src/components/PresenceAvatar.tsx - NO ZUSTAND STORE
"use client";

import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { cn } from "@/lib/utils";
import { usePresenceStore } from "@/hooks/usePresenceStore";

type Props = {
  userId?: string;
  src?: string | null;
  name?: string;
  size?: "sm" | "md" | "lg";
};

export default function PresenceAvatar({
  userId,
  src,
  name,
  size = "md",
}: Props) {
  const isOnline = usePresenceStore((state) =>
    userId ? state.onlineMembers.includes(userId) : false
  );

  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-16 w-16",
  };

  const indicatorSizeClasses = {
    sm: "h-2 w-2 border",
    md: "h-3 w-3 border-2",
    lg: "h-4 w-4 border-2",
  };

  return (
    <div className="relative">
      <Avatar className={cn(sizeClasses[size])}>
        <AvatarImage
          src={src || "/images/user.png"}
          alt={name || "User avatar"}
        />
        <AvatarFallback className="bg-linear-to-br from-primary to-secondary text-primary-foreground">
          {name ? name.charAt(0).toUpperCase() : "U"}
        </AvatarFallback>
      </Avatar>

      {/* Simple presence indicator */}
      {userId && (
        <span
          className={cn(
            "absolute bottom-0 right-0 rounded-full border-card shadow-sm transition-colors",
            indicatorSizeClasses[size],
            isOnline ? "bg-success" : "bg-muted-foreground/30"
          )}
          title={isOnline ? "Online" : "Offline"}
        />
      )}
    </div>
  );
}
