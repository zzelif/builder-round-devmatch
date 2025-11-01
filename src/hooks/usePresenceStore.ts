// src/hooks/usePresenceStore.ts
import { create } from "zustand";

export type PresenceState = {
  onlineMembers: string[];
};

export type PresenceActions = {
  addMember: (id: string) => void;
  removeMember: (id: string) => void;
  setMembers: (ids: string[]) => void;
  isOnline: (id: string) => boolean;
};

export type PresenceStore = PresenceState & PresenceActions;

export const usePresenceStore = create<PresenceStore>((set, get) => ({
  onlineMembers: [],
  addMember: (id: string) =>
    set((state) => ({
      onlineMembers: Array.from(new Set([...state.onlineMembers, id])),
    })),
  removeMember: (id: string) =>
    set((state) => ({
      onlineMembers: state.onlineMembers.filter((memberId) => memberId !== id),
    })),
  setMembers: (ids: string[]) => set({ onlineMembers: ids }),
  isOnline: (id: string) => get().onlineMembers.includes(id),
}));
