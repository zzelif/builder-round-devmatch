// src/hooks/useMessageStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type MessageState = {
  unreadCount: number;
};

export type MessageActions = {
  updateUnreadCount: (amount: number) => void;
  setUnreadCount: (count: number) => void;
  resetMessages: () => void;
};

export type MessageStore = MessageState & MessageActions;

export const useMessageStore = create<MessageStore>()(
  persist(
    (set) => ({
      unreadCount: 0,
      updateUnreadCount: (amount: number) =>
        set((state) => ({
          unreadCount: Math.max(0, state.unreadCount + amount),
        })),
      setUnreadCount: (count: number) => set({ unreadCount: count }),
      resetMessages: () => set({ unreadCount: 0 }),
    }),
    {
      name: "message-store",
    }
  )
);
