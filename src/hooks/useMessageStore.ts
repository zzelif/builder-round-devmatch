// src/hooks/useMessageStore.ts
import { create } from "zustand";

interface MessageState {
  unreadCount: number;
  updateUnreadCount: (amount: number) => void;
  resetMessages: () => void;
}

const serverSnapshot = JSON.stringify({ unreadCount: 0 });

export const useMessageStore = create<MessageState>((set) => ({
  unreadCount: 0,
  updateUnreadCount: (amount: number) => {
    set((state) => ({
      unreadCount: Math.max(0, state.unreadCount + amount),
    }));
  },
  resetMessages: () => set({ unreadCount: 0 }),
}));

export const getServerSnapshot = () => serverSnapshot;
