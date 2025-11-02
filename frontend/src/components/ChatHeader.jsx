import { useState, useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { useBlockStore } from "../store/useBlockStore";
import { X, MoreVertical, Shield, ShieldOff } from "lucide-react";
import toast from "react-hot-toast";
import Avatar from "./Avatar";

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
    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="relative">
            <Avatar 
              src={selectedUser.profilePic} 
              name={selectedUser.fullName} 
              size="w-10 h-10"
            />
            {isOnline && (
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
            )}
          </div>
          <div className="ml-3">
            <p className="font-medium text-gray-900 dark:text-white">{selectedUser.fullName}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {isOnline ? "Online" : "Offline"}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <MoreVertical className="w-5 h-5" />
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10">
                <button
                  onClick={toggleBlock}
                  disabled={isBlocking}
                  className={`w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-2 disabled:opacity-50 ${
                    isBlocked ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {isBlocked ? <ShieldOff className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
                  <span>
                    {isBlocking 
                      ? (isBlocked ? "Unblocking..." : "Blocking...") 
                      : (isBlocked ? "Unblock User" : "Block User")
                    }
                  </span>
                </button>
              </div>
            )}
          </div>

          <button
            onClick={() => setSelectedUser(null)}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;