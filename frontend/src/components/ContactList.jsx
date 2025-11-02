import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { useUnreadStore } from "../store/useUnreadStore";
import { axiosInstance } from "../lib/axios";
import Avatar from "./Avatar";

const ContactList = ({ users, selectedUser }) => {
  const { setSelectedUser, getUsers } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const { clearUnreadCount } = useUnreadStore();

  const handleUserSelect = async (user) => {
    setSelectedUser(user);
    
    // Immediately clear unread count in UI
    clearUnreadCount(user._id || user.id);
    
    // Mark messages as read in backend
    try {
      await axiosInstance.put(`/messages/read/${user._id || user.id}`);
      // Refresh users to sync with backend
      getUsers();
    } catch (error) {
      console.error("Error marking messages as read:", error);
    }
  };

  return (
    <div className="overflow-y-auto">
      {users.map((user) => (
        <button
          key={user._id || user.id}
          onClick={() => handleUserSelect(user)}
          className={`w-full p-4 flex items-center space-x-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors relative ${
            (selectedUser?._id || selectedUser?.id) === (user._id || user.id) ? "bg-primary-50 dark:bg-primary-900/20 border-r-2 border-primary-500" : ""
          }`}
        >
          <div className="relative">
            <Avatar 
              src={user.profilePic} 
              name={user.fullName} 
              size="w-12 h-12"
            />
            {onlineUsers.includes(user._id || user.id) && (
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
            )}
          </div>

          <div className="flex-1 text-left">
            <div className="flex items-center justify-between">
              <p className="font-medium text-gray-900 dark:text-white">{user.fullName}</p>
              <div className="flex items-center space-x-2">
                {(user.unreadCount > 0) && (
                  <span className="bg-primary-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                    {user.unreadCount}
                  </span>
                )}
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {onlineUsers.includes(user._id || user.id) ? "Online" : "Offline"}
                </span>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
              {user.lastMessage?.text || user.phone}
            </p>
          </div>
        </button>
      ))}

      {users.length === 0 && (
        <div className="p-8 text-center">
          <p className="text-gray-500 dark:text-gray-400">No contacts found</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
            Add contacts to start chatting
          </p>
        </div>
      )}
    </div>
  );
};

export default ContactList;