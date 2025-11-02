import { useChatStore } from "../store/useChatStore";
import { formatMessageTime } from "../lib/utils";
import MessageStatus from "./MessageStatus";
import { axiosInstance } from "../lib/axios";

const MessageList = ({ messages, authUser, selectedUser }) => {
  const { typingUsers } = useChatStore();
  const isTyping = typingUsers[selectedUser._id || selectedUser.id];

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 message-container" style={{ scrollBehavior: 'smooth' }}>
      {messages.map((message) => (
        <div
          key={message._id || message.id}
          className={`flex ${(message.senderId._id || message.senderId.id || message.senderId) === (authUser._id || authUser.id) ? "justify-end" : "justify-start"} message-animation`}
        >
          <div
            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
              (message.senderId._id || message.senderId.id || message.senderId) === (authUser._id || authUser.id)
                ? "bg-primary-500 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white"
            }`}
          >
            {message.image && (
              <img
                src={message.image}
                alt="Message attachment"
                className="mb-2 rounded-lg max-w-full h-auto"
              />
            )}
            {message.text && <p className="text-sm">{message.text}</p>}
            <div className="flex items-center justify-between mt-1">
              <p
                className={`text-xs ${
                  (message.senderId._id || message.senderId.id || message.senderId) === (authUser._id || authUser.id)
                    ? "text-primary-100"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              >
                {formatMessageTime(message.createdAt)}
              </p>
              <MessageStatus message={message} authUser={authUser} />
            </div>
          </div>
        </div>
      ))}

      {isTyping && (
        <div className="flex justify-start">
          <div className="bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded-lg">
            <div className="typing-indicator">
              <div className="typing-dot"></div>
              <div className="typing-dot"></div>
              <div className="typing-dot"></div>
            </div>
          </div>
        </div>
      )}

      {messages.length === 0 && (
        <div className="text-center text-gray-500 dark:text-gray-400 mt-8">
          <p>No messages yet</p>
          <p className="text-sm">Start a conversation with {selectedUser.fullName}</p>
        </div>
      )}
    </div>
  );
};

export default MessageList;