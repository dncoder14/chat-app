import { useEffect, useRef } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { useBlockStore } from "../store/useBlockStore";
import { axiosInstance } from "../lib/axios";
import { Shield } from "lucide-react";

import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();

  const { authUser } = useAuthStore();
  const { isUserBlocked } = useBlockStore();
  const messageEndRef = useRef(null);
  
  const isBlocked = isUserBlocked(selectedUser._id || selectedUser.id);

  useEffect(() => {
    const userId = selectedUser._id || selectedUser.id;
    getMessages(userId);
    subscribeToMessages();
    
    // Mark messages as read when opening chat
    const markAsRead = async () => {
      try {
        await axiosInstance.put(`/messages/read/${userId}`);
      } catch (error) {
        console.error("Error marking messages as read:", error);
      }
    };
    
    markAsRead();

    return () => unsubscribeFromMessages();
  }, [selectedUser._id || selectedUser.id, getMessages, subscribeToMessages, unsubscribeFromMessages]);

  useEffect(() => {
    const scrollToBottom = () => {
      const container = document.querySelector('.message-container');
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    };
    
    // Multiple scroll attempts to ensure it works
    scrollToBottom();
    setTimeout(scrollToBottom, 50);
    setTimeout(scrollToBottom, 200);
  }, [messages]);

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-hidden">
        <ChatHeader />
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className={`flex ${i % 2 === 0 ? "justify-end" : "justify-start"}`}>
              <div className="skeleton h-12 w-48 rounded-lg"></div>
            </div>
          ))}
        </div>
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="skeleton h-12 w-full rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <ChatHeader />
      
      <MessageList 
        messages={messages} 
        authUser={authUser} 
        selectedUser={selectedUser}
      />
      
      <div ref={messageEndRef} />
      
      {!isBlocked ? (
        <MessageInput />
      ) : (
        <div className="p-4 bg-gray-100 dark:bg-gray-800 text-center border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-center space-x-2 text-gray-600 dark:text-gray-400">
            <Shield className="w-5 h-5" />
            <p>You have blocked this user. Unblock from the menu above to send messages.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatContainer;