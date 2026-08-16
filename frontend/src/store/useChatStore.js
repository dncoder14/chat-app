import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  typingUsers: {},

  // `silent` skips the loading flag for background refreshes (new message
  // arriving, contact added, etc.) so the sidebar updates in place instead
  // of flashing back to the full skeleton screen every time.
  getUsers: async (silent = false) => {
    if (!silent) set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data, isUsersLoading: false });
    } catch (error) {
      console.error("Error fetching users:", error);
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    const receiverId = selectedUser._id || selectedUser.id;
    const authUser = useAuthStore.getState().authUser;
    const authUserId = authUser._id || authUser.id;

    // Show the message immediately with a pending status (see MessageStatus)
    // rather than waiting for the round trip, since that's especially slow
    // and jarring for image uploads.
    const tempId = `temp-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const optimisticMessage = {
      id: tempId,
      senderId: authUserId,
      receiverId,
      text: messageData.text || null,
      image: messageData.image || null,
      isDelivered: false,
      isRead: false,
      pending: true,
      createdAt: new Date().toISOString(),
    };
    set({ messages: [...messages, optimisticMessage] });

    try {
      const res = await axiosInstance.post(`/messages/send/${receiverId}`, messageData);
      set({ messages: get().messages.map((m) => (m.id === tempId ? res.data : m)) });
      // The backend only pushes newMessage/newMessage_chat socket events to
      // the receiver, so the sender needs to refresh their own sidebar here
      // to see their outgoing message reflected as the latest.
      get().getUsers(true);
    } catch (error) {
      set({ messages: get().messages.filter((m) => m.id !== tempId) });
      toast.error(error.response?.data?.error || "Failed to send message");
      throw error;
    }
  },

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    // Remove existing chat-specific listeners to prevent duplicates
    socket.off("newMessage_chat");
    socket.off("userTyping");

    socket.on("newMessage_chat", (newMessage) => {
      const authUser = useAuthStore.getState().authUser;
      const authUserId = authUser._id || authUser.id;
      const selectedUserId = selectedUser._id || selectedUser.id;
      const senderId = newMessage.senderId?.id || newMessage.senderId?._id || newMessage.senderId;
      const receiverId = newMessage.receiverId?.id || newMessage.receiverId?._id || newMessage.receiverId;
      
      console.log('New message received:', {
        senderId,
        receiverId,
        authUserId,
        selectedUserId,
        messageText: newMessage.text
      });
      
      // Check if message is between current user and selected user
      const isMessageBetweenUsers = 
        (senderId === selectedUserId && receiverId === authUserId) || 
        (senderId === authUserId && receiverId === selectedUserId);
      
      if (isMessageBetweenUsers) {
        // Check if current user has blocked the sender
        const blockedUsers = Array.isArray(authUser?.blockedUsers) ? authUser.blockedUsers : [];
        if (blockedUsers.includes(senderId)) {
          return; // Don't add message if sender is blocked
        }
        
        console.log('Adding message to chat');
        set({
          messages: [...get().messages, newMessage],
        });
        
        // Auto-mark as read if message is from selected user to current user
        if (senderId === selectedUserId && receiverId === authUserId) {
          setTimeout(async () => {
            try {
              await axiosInstance.put(`/messages/read/${senderId}`);
              // Sidebar will be refreshed by global listener
            } catch (error) {
              console.error("Error auto-marking message as read:", error);
            }
          }, 500);
        }
      }
    });

    socket.on("userTyping", ({ senderId, isTyping }) => {
      if (senderId === (selectedUser._id || selectedUser.id)) {
        set({
          typingUsers: {
            ...get().typingUsers,
            [senderId]: isTyping,
          },
        });
      }
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (socket) {
      socket.off("newMessage_chat");
      socket.off("userTyping");
    }
  },

  setSelectedUser: (selectedUser) => {
    set({ selectedUser });
  },

  setTyping: (receiverId, isTyping) => {
    const socket = useAuthStore.getState().socket;
    socket.emit("typing", { receiverId, isTyping });
  },

  setMessages: (messages) => {
    set({ messages });
  },
}));