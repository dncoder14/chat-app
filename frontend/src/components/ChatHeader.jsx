import { useState, useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { useBlockStore } from "../store/useBlockStore";
import { ArrowLeft, MoreVertical, Shield, ShieldOff } from "lucide-react";
import toast from "react-hot-toast";
import Avatar from "./Avatar";
import IconButton from "./ui/IconButton";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const { isUserBlocked, blockUser, unblockUser, fetchBlockedUsers } = useBlockStore();
  const [showMenu, setShowMenu] = useState(false);
  const [isBlocking, setIsBlocking] = useState(false);

  const userId = selectedUser._id || selectedUser.id;
  const isOnline = onlineUsers.includes(userId);
  const isBlocked = isUserBlocked(userId);

  useEffect(() => {
    fetchBlockedUsers();
  }, [selectedUser, fetchBlockedUsers]);

  const toggleBlock = async () => {
    setIsBlocking(true);
    try {
      if (isBlocked) {
        await unblockUser(userId);
        toast.success("User unblocked successfully");
      } else {
        await blockUser(userId);
        toast.success("User blocked successfully");
      }
    } catch (error) {
      toast.error(`Failed to ${isBlocked ? 'unblock' : 'block'} user`);
    } finally {
      setIsBlocking(false);
      setShowMenu(false);
    }
  };

  return (
    <div className="bg-surface border-b border-border px-4 sm:px-5 py-3.5 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center min-w-0">
          <IconButton
            icon={ArrowLeft}
            label="Back to conversations"
            onClick={() => setSelectedUser(null)}
            className="mr-1 md:hidden"
          />
          <Avatar
            src={selectedUser.profilePic}
            name={selectedUser.fullName}
            size="w-10 h-10"
            online={isOnline}
          />
          <div className="ml-3 min-w-0">
            <p className="font-semibold text-foreground truncate leading-tight">{selectedUser.fullName}</p>
            <p className={`text-xs mt-0.5 flex items-center gap-1.5 ${isOnline ? "text-success" : "text-muted"}`}>
              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isOnline ? "bg-success" : "bg-muted/50"}`} />
              {isOnline ? "Online" : "Offline"}
            </p>
          </div>
        </div>

        <div className="relative shrink-0">
          <IconButton
            icon={MoreVertical}
            label="More options"
            onClick={() => setShowMenu(!showMenu)}
          />

          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-surface rounded-lg shadow-md border border-border z-10 modal-pop overflow-hidden">
              <button
                onClick={toggleBlock}
                disabled={isBlocking}
                className={`w-full px-4 py-2.5 text-left hover:bg-surface-secondary flex items-center gap-2 text-sm disabled:opacity-50 transition-colors ${
                  isBlocked ? "text-success" : "text-danger"
                }`}
              >
                {isBlocked ? <ShieldOff className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
                <span>
                  {isBlocking
                    ? (isBlocked ? "Unblocking..." : "Blocking...")
                    : (isBlocked ? "Unblock User" : "Block User")}
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
