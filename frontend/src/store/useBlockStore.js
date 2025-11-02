import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

export const useBlockStore = create((set, get) => ({
  blockedUsers: [],
  isLoading: false,

  fetchBlockedUsers: async () => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get("/contacts/blocked");
      set({ blockedUsers: res.data });
    } catch (error) {
      console.error("Error fetching blocked users:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  isUserBlocked: (userId) => {
    const { blockedUsers } = get();
    return blockedUsers.some(user => (user._id || user.id) === userId);
  },

  blockUser: async (userId) => {
    try {
      await axiosInstance.post(`/contacts/block/${userId}`);
      await get().fetchBlockedUsers();
    } catch (error) {
      throw error;
    }
  },

  unblockUser: async (userId) => {
    try {
      await axiosInstance.post(`/contacts/unblock/${userId}`);
      await get().fetchBlockedUsers();
    } catch (error) {
      throw error;
    }
  },
}));