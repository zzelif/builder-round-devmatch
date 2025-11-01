// src/components/NotificationProvider.tsx - THEIR PATTERN
"use client";

import { ReactNode } from "react";
import { useNotificationChannel } from "@/hooks/useNotificationChannel";
import { usePresenceChannel } from "@/hooks/usePresenceChannel";
import { Session } from "next-auth";

interface NotificationProviderProps {
  children: ReactNode;
  session: Session | null;
  profileComplete: boolean;
}

export default function NotificationProvider({
  children,
  session,
  profileComplete,
}: NotificationProviderProps) {
  const userId = session?.user?.id;

  useNotificationChannel(userId || "", profileComplete);
  usePresenceChannel(userId || "", profileComplete);

  return <>{children}</>;
}
