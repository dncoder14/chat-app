import { create } from "zustand";

export const useUnreadStore = create((set, get) => ({
  unreadCounts: {},

  setUnreadCount: (userId, count) => {
    set(state => ({
      unreadCounts: {
        ...state.unreadCounts,
        [userId]: count
      }
    }));
  },

  clearUnreadCount: (userId) => {
    set(state => ({
      unreadCounts: {
        ...state.unreadCounts,
        [userId]: 0
      }
    }));
  },

  getUnreadCount: (userId) => {
    return get().unreadCounts[userId] || 0;
  }
}));