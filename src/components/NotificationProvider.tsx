// src/components/NotificationProvider.tsx - THEIR PATTERN
"use client";

import { ReactNode } from "react";
import { useNotificationChannel } from "@/hooks/useNotificationChannel";
import { usePresenceChannel } from "@/hooks/usePresenceChannel";
import { Session } from "next-auth";

interface NotificationProviderProps {
  children: ReactNode;
  session: Session | null;
}

export default function NotificationProvider({
  children,
  session,
}: NotificationProviderProps) {
  const userId = session?.user?.id;

  useNotificationChannel(userId || "");
  usePresenceChannel(userId || "");

  return <>{children}</>;
}
