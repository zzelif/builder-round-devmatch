// src/hooks/useNotificationChannel.ts - THEIR PATTERN
"use client";

import { useEffect } from "react";
import { pusherClient } from "@/lib/pusher";
import { useMessageStore } from "./useMessageStore";
import { toast } from "react-toastify";
import { usePathname, useRouter } from "next/navigation";

interface MessageNotification {
  senderName: string;
  senderId: string;
  recipientId: string;
  text: string;
  created: string;
}

interface LikeNotification {
  name: string;
  userId: string;
  image?: string;
}

interface MatchNotification {
  name: string;
  userId: string;
  image?: string;
}

export const useNotificationChannel = (
  userId: string | null,
  profileComplete: boolean
) => {
  const { updateUnreadCount } = useMessageStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    console.log(
      "🔍 Notification Channel - userId:",
      userId,
      "profileComplete:",
      profileComplete
    );
  }, [userId, profileComplete]);

  useEffect(() => {
    if (!pusherClient || !userId || !profileComplete) {
      console.log("⚠️ Skipping notification channel:", {
        pusherClient: !!pusherClient,
        userId,
        profileComplete,
      });
      return;
    }

    const channel = pusherClient.subscribe(`private-${userId}`);

    // New message
    channel.bind("message:new", (data: MessageNotification) => {
      console.log("📩 New message received:", data);
      updateUnreadCount(1);

      toast.info(`New message from ${data.senderName}`, {
        position: "bottom-right",
        autoClose: 3000,
      });

      // Refresh if on messages page
      if (pathname.startsWith("/messages")) {
        router.refresh();
      }
    });

    // New like
    channel.bind("like:new", (data: LikeNotification) => {
      toast.success(`${data.name} liked you! 💖`, {
        position: "bottom-right",
        autoClose: 5000,
      });

      if (pathname.startsWith("/lists")) {
        router.refresh();
      }
    });

    // New match
    channel.bind("match:new", (data: MatchNotification) => {
      toast.success(`It's a match with ${data.name}! ✨`, {
        position: "bottom-right",
        autoClose: 5000,
      });

      if (pathname.startsWith("/lists")) {
        router.refresh();
      }
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [userId, updateUnreadCount, router, pathname, profileComplete]);
};
