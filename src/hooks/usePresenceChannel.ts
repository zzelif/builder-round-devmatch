// src/hooks/usePresenceChannel.ts - THEIR PATTERN
"use client";

import { useEffect } from "react";
import { pusherClient } from "@/lib/pusher";
import { usePresenceStore } from "./usePresenceStore";

interface UserInfo {
  [key: string]: string | number | boolean;
}

interface PusherPresenceData {
  members: Record<string, { user_id: string; user_info?: UserInfo }>;
}

interface PusherMember {
  user_id: string;
  user_info?: UserInfo;
}

export const usePresenceChannel = (
  userId: string | null,
  profileComplete: boolean
) => {
  const { addMember, removeMember, setMembers } = usePresenceStore();

  useEffect(() => {
    if (!pusherClient || !userId || !profileComplete) return;

    const channel = pusherClient.subscribe("presence-online");

    channel.bind(
      "pusher:subscription_succeeded",
      (members: PusherPresenceData) => {
        const memberIds = Object.keys(members.members);
        setMembers(memberIds);
      }
    );

    channel.bind("pusher:member_added", (member: PusherMember) => {
      addMember(member.user_id);
    });

    channel.bind("pusher:member_removed", (member: PusherMember) => {
      removeMember(member.user_id);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [userId, addMember, removeMember, setMembers, profileComplete]);
};
