import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { initializeSocket } from "../lib/socket.js";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSendingOtp: false,
  isVerifyingOtp: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  isConnecting: false,
  onlineUsers: [],
  socket: null,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
      get().connectSocket();
    } catch (error) {
      console.log("Error in checkAuth:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  // Backend generates the OTP (no SMS vendor wired in yet) and echoes it
  // back in dev mode so the frontend can show it directly. Returns the
  // response data so the caller (LoginPage) can display it.
  sendOtp: async (phone) => {
    set({ isSendingOtp: true });
    try {
      const res = await axiosInstance.post("/auth/send-otp", { phone });
      return res.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send OTP");
      throw error;
    } finally {
      set({ isSendingOtp: false });
    }
  },

  // Verifies the OTP with the backend. Returns the response data so the
  // caller (LoginPage) can react to `{ newUser: true }` by prompting for a
  // full name and calling this again.
  verifyOtp: async ({ phone, otp, fullName }) => {
    set({ isVerifyingOtp: true });
    try {
      const res = await axiosInstance.post("/auth/verify-otp", { phone, otp, fullName });
      if (res.data.newUser) {
        return res.data;
      }
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
      }
      set({ authUser: res.data });
      toast.success("Logged in successfully");
      get().connectSocket();
      return res.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Verification failed");
      throw error;
    } finally {
      set({ isVerifyingOtp: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      localStorage.removeItem('token');
      set({ authUser: null });
      toast.success("Logged out successfully");
      get().disconnectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.log("error in update profile:", error);
      toast.error(error.response.data.message);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;
    
    // Prevent multiple connection attempts
    if (get().isConnecting) return;
    set({ isConnecting: true });

    const socket = initializeSocket(authUser._id || authUser.id);
    socket.connect();

    set({ socket: socket, isConnecting: false });

    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });

    socket.on("userOnline", (userId) => {
      set({ onlineUsers: [...get().onlineUsers, userId] });
    });

    socket.on("userOffline", (userId) => {
      set({ onlineUsers: get().onlineUsers.filter(id => id !== userId) });
    });





    // Global message listener for sidebar updates
    socket.on("newMessage", (newMessage) => {
      const authUserId = authUser._id || authUser.id;
      // Only refresh sidebar if message involves current user
      if (newMessage.receiverId === authUserId || newMessage.senderId === authUserId) {
        import("./useChatStore.js").then(({ useChatStore }) => {
          const { selectedUser } = useChatStore.getState();
          const selectedUserId = selectedUser?._id || selectedUser?.id;
          const senderId = newMessage.senderId?.id || newMessage.senderId?._id || newMessage.senderId;
          
          // If message is from selected user (chat is open), delay refresh to allow auto-read
          if (selectedUserId && senderId === selectedUserId && newMessage.receiverId === authUserId) {
            setTimeout(() => {
              useChatStore.getState().getUsers();
            }, 700);
          } else {
            // Immediate refresh for other cases
            useChatStore.getState().getUsers();
          }
        });
      }
    });

    // Global message read listener for status updates
    socket.on("messagesRead", ({ readBy }) => {
      // Import chat store to update message status
      import("./useChatStore.js").then(({ useChatStore }) => {
        const { messages, setMessages } = useChatStore.getState();
        const updatedMessages = messages.map(msg => {
          const senderId = msg.senderId?.id || msg.senderId?._id || msg.senderId;
          const authUserId = authUser._id || authUser.id;
          if (senderId === authUserId) {
            return { ...msg, isRead: true, readAt: new Date() };
          }
          return msg;
        });
        setMessages(updatedMessages);
      });
    });
  },

  disconnectSocket: () => {
    const socket = get().socket;
    if (socket?.connected) {
      socket.off("newMessage");
      socket.off("messagesRead");
      socket.disconnect();
    }
  },
}));