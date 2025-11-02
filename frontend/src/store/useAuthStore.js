import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { initializeSocket } from "../lib/socket.js";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
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

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      toast.success("Account created successfully");
      get().connectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success("Logged in successfully");
      get().connectSocket();
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
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