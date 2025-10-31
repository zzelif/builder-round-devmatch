// src/hooks/useMessageStore.ts - FIXED SERVER SNAPSHOT CACHING
import { create } from "zustand";

interface MessageState {
  unreadCount: number;
  updateUnreadCount: (amount: number) => void;
  resetMessages: () => void;
}

// ✅ Cache the server snapshot to prevent infinite loops
let cachedServerSnapshot: string | null = null;

export const useMessageStore = create<MessageState>((set, get) => ({
  unreadCount: 0,
  updateUnreadCount: (amount: number) => {
    set((state) => ({
      unreadCount: Math.max(0, state.unreadCount + amount),
    }));
  },
  resetMessages: () => set({ unreadCount: 0 }),
}));

// ✅ Add stable server snapshot function
if (typeof window === "undefined") {
  cachedServerSnapshot = JSON.stringify({ unreadCount: 0 });
}

// Export for server-side rendering compatibility
export const getServerSnapshot = () => {
  if (!cachedServerSnapshot) {
    cachedServerSnapshot = JSON.stringify({ unreadCount: 0 });
  }
  return cachedServerSnapshot;
};
