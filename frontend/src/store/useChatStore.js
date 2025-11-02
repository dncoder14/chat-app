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

  getUsers: async () => {
    set({ isUsersLoading: true });
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
    try {
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id || selectedUser.id}`, messageData);
      set({ messages: [...messages, res.data] });
      
      // Force scroll to bottom after sending
      setTimeout(() => {
        const messageContainer = document.querySelector('.message-container');
        if (messageContainer) {
          messageContainer.scrollTop = messageContainer.scrollHeight;
        }
      }, 100);
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to send message");
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
      
      // Only refresh sidebar for sent messages (received messages are handled by global listener)
      if (senderId === authUserId) {
        get().getUsers();
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