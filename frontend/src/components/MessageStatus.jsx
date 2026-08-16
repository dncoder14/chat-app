import { Check, CheckCheck } from "lucide-react";

const MessageStatus = ({ message, authUser }) => {
  // Only show status for messages sent by current user
  if ((message.senderId._id || message.senderId.id || message.senderId) !== (authUser._id || authUser.id)) return null;

  return (
    <div className="flex items-center">
      {message.isRead ? (
        <CheckCheck className="w-3.5 h-3.5 text-sky-200" />
      ) : message.isDelivered ? (
        <Check className="w-3.5 h-3.5 text-white/70" />
      ) : (
        <div className="w-1.5 h-1.5 bg-white/70 rounded-full" />
      )}
    </div>
  );
};

export default MessageStatus;