// src/app/messages/SyncUnreadStore.tsx
"use client";

import { useEffect } from "react";
import { useMessageStore } from "@/hooks/useMessageStore";

interface SyncUnreadStoreProps {
  initialCount: number;
}

export default function SyncUnreadStore({
  initialCount,
}: SyncUnreadStoreProps) {
  const setUnreadCount = useMessageStore((state) => state.setUnreadCount);

  useEffect(() => {
    setUnreadCount(initialCount);
  }, [initialCount, setUnreadCount]);

  return null;
}
