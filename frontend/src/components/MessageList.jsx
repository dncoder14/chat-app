import { useMemo } from "react";
import { useChatStore } from "../store/useChatStore";
import { MessageCircle } from "lucide-react";
import DateSeparator from "./ui/DateSeparator";
import MessageBubble from "./ui/MessageBubble";
import EmptyState from "./ui/EmptyState";
import Avatar from "./Avatar";

const getSenderId = (senderId) => senderId?._id || senderId?.id || senderId;

const isSameDay = (a, b) => {
  const d1 = new Date(a);
  const d2 = new Date(b);
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
};

const MessageList = ({ messages, authUser, selectedUser }) => {
  const { typingUsers } = useChatStore();
  const isTyping = typingUsers[selectedUser._id || selectedUser.id];
  const authUserId = authUser._id || authUser.id;

  const items = useMemo(() => {
    return messages.map((message, index) => {
      const prev = messages[index - 1];
      const next = messages[index + 1];
      const showDateSeparator = !prev || !isSameDay(prev.createdAt, message.createdAt);
      const grouped =
        !showDateSeparator && prev && getSenderId(prev.senderId) === getSenderId(message.senderId);
      const groupEnd =
        !next ||
        !isSameDay(message.createdAt, next.createdAt) ||
        getSenderId(next.senderId) !== getSenderId(message.senderId);
      return { message, showDateSeparator, grouped, groupEnd };
    });
  }, [messages]);

  return (
    <div
      className="flex-1 overflow-y-auto px-4 sm:px-6 py-5 message-container"
      style={{ scrollBehavior: "smooth" }}
    >
      {items.map(({ message, showDateSeparator, grouped, groupEnd }) => (
        <div key={message._id || message.id}>
          {showDateSeparator && <DateSeparator date={message.createdAt} />}
          <MessageBubble
            message={message}
            isOwn={getSenderId(message.senderId) === authUserId}
            authUser={authUser}
            otherUser={selectedUser}
            grouped={grouped}
            groupEnd={groupEnd}
          />
        </div>
      ))}

      {isTyping && (
        <div className="flex items-end gap-2 justify-start mt-4">
          <Avatar src={selectedUser.profilePic} name={selectedUser.fullName} size="w-7 h-7" className="mb-0.5" />
          <div className="bg-surface-secondary px-4 py-2.5 rounded-2xl rounded-bl-md">
            <div className="typing-indicator">
              <div className="typing-dot"></div>
              <div className="typing-dot"></div>
              <div className="typing-dot"></div>
            </div>
          </div>
        </div>
      )}

      {messages.length === 0 && !isTyping && (
        <EmptyState
          icon={MessageCircle}
          title="No messages yet"
          description={`Start a conversation with ${selectedUser.fullName}`}
          className="h-full"
        />
      )}
    </div>
  );
};

export default MessageList;
