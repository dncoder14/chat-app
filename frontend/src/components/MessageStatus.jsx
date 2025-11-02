import { Check, CheckCheck } from "lucide-react";

const MessageStatus = ({ message, authUser }) => {
  // Only show status for messages sent by current user
  if ((message.senderId._id || message.senderId.id || message.senderId) !== (authUser._id || authUser.id)) return null;

  return (
    <div className="flex items-center space-x-1 ml-2">
      {message.isRead ? (
        <CheckCheck className="w-4 h-4 text-blue-500" />
      ) : message.isDelivered ? (
        <Check className="w-4 h-4 text-gray-400" />
      ) : (
        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
      )}
    </div>
  );
};

export default MessageStatus;