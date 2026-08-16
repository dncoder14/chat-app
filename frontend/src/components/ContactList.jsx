import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { axiosInstance } from "../lib/axios";
import { Users } from "lucide-react";
import ConversationItem from "./ui/ConversationItem";
import EmptyState from "./ui/EmptyState";

const ContactList = ({ users, selectedUser }) => {
  const { setSelectedUser, getUsers } = useChatStore();
  const { onlineUsers } = useAuthStore();

  const handleUserSelect = async (user) => {
    setSelectedUser(user);

    // Mark messages as read in backend
    try {
      await axiosInstance.put(`/messages/read/${user._id || user.id}`);
      // Refresh users to sync with backend
      getUsers();
    } catch (error) {
      console.error("Error marking messages as read:", error);
    }
  };

  if (users.length === 0) {
    return (
      <EmptyState
        icon={Users}
        title="No contacts found"
        description="Add contacts to start chatting"
      />
    );
  }

  return (
    <div className="space-y-0.5">
      {users.map((user) => (
        <ConversationItem
          key={user._id || user.id}
          user={user}
          isSelected={(selectedUser?._id || selectedUser?.id) === (user._id || user.id)}
          isOnline={onlineUsers.includes(user._id || user.id)}
          onSelect={handleUserSelect}
        />
      ))}
    </div>
  );
};

export default ContactList;
