import Avatar from "../Avatar";
import MessageStatus from "../MessageStatus";
import { formatMessageTime } from "../../lib/utils";

const MessageBubble = ({ message, isOwn, authUser, otherUser, grouped, groupEnd }) => {
  const hasImage = Boolean(message.image);
  const hasText = Boolean(message.text);

  const cornerRadius = grouped
    ? isOwn
      ? "rounded-2xl rounded-tr-md"
      : "rounded-2xl rounded-tl-md"
    : "rounded-2xl";

  return (
    <div
      className={`flex items-end gap-2 ${isOwn ? "justify-end" : "justify-start"} ${
        grouped ? "mt-0.5" : "mt-4"
      } message-animation`}
    >
      {!isOwn &&
        (groupEnd ? (
          <Avatar
            src={otherUser.profilePic}
            name={otherUser.fullName}
            size="w-7 h-7"
            className="mb-0.5"
          />
        ) : (
          <span className="w-7 h-7 shrink-0" aria-hidden="true" />
        ))}

      <div
        className={`max-w-[75%] md:max-w-[60%] xl:max-w-[50%] overflow-hidden ${cornerRadius} ${
          hasImage
            ? "bg-surface border border-border shadow-sm p-1"
            : `px-4 py-2.5 ${isOwn ? "bg-primary text-white" : "bg-surface-secondary text-foreground"}`
        }`}
      >
        {hasImage && (
          <div className="relative">
            <img
              src={message.image}
              alt="Message attachment"
              className="block h-auto w-auto max-h-80 max-w-full rounded-xl object-contain"
            />
            {!hasText && (
              <span className="absolute bottom-1.5 right-1.5 flex items-center gap-1 rounded-full bg-black/45 backdrop-blur-sm px-2 py-0.5 text-[10px] text-white">
                {formatMessageTime(message.createdAt)}
                <MessageStatus message={message} authUser={authUser} />
              </span>
            )}
          </div>
        )}

        {hasText && (
          <p
            className={`text-sm leading-relaxed whitespace-pre-wrap break-words ${
              hasImage ? "px-2 pt-2 text-foreground" : ""
            }`}
          >
            {message.text}
          </p>
        )}

        {(!hasImage || hasText) && (
          <div className={`flex items-center justify-end gap-1.5 ${hasImage ? "px-2 pb-1 pt-1" : "mt-1"}`}>
            <span className={`text-[11px] ${isOwn && !hasImage ? "text-white/70" : "text-muted"}`}>
              {formatMessageTime(message.createdAt)}
            </span>
            <MessageStatus message={message} authUser={authUser} />
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
