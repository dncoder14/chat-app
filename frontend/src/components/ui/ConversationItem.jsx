import Avatar from "../Avatar";
import { formatMessageTime } from "../../lib/utils";

const ConversationItem = ({ user, isSelected, onSelect }) => {
  const hasUnread = user.unreadCount > 0;
  const preview = user.lastMessage?.text
    ? user.lastMessage.text
    : user.lastMessage?.image
    ? "📷 Photo"
    : user.phone;

  return (
    <button
      onClick={() => onSelect(user)}
      className={`w-full px-3 py-2.5 flex items-center gap-3 text-left rounded-xl transition-colors duration-150 ${
        isSelected
          ? "bg-primary-soft"
          : "hover:bg-surface-secondary"
      }`}
    >
      <Avatar src={user.profilePic} name={user.fullName} size="w-12 h-12" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p
            className={`truncate ${
              hasUnread ? "font-semibold text-foreground" : "font-medium text-foreground"
            }`}
          >
            {user.fullName}
          </p>
          {user.lastMessage?.createdAt && (
            <span
              className={`text-xs shrink-0 ${
                hasUnread ? "text-primary font-semibold" : "text-muted"
              }`}
            >
              {formatMessageTime(user.lastMessage.createdAt)}
            </span>
          )}
        </div>
        <div className="flex items-center justify-between gap-2 mt-0.5">
          <p className={`text-sm truncate ${hasUnread ? "text-foreground/80 font-medium" : "text-muted"}`}>
            {preview}
          </p>
          {hasUnread && (
            <span className="shrink-0 bg-primary text-white text-[11px] font-semibold rounded-full min-w-[18px] h-[18px] px-1 flex items-center justify-center">
              {user.unreadCount}
            </span>
          )}
        </div>
      </div>
    </button>
  );
};

export default ConversationItem;
