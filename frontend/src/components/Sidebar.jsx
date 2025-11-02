import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { useStoryStore } from "../store/useStoryStore";
import { Settings, LogOut, Plus, Search, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";
import ContactList from "./ContactList";
import StoryList from "./StoryList";
import AddContactModal from "./AddContactModal";
import CreateStoryModal from "./CreateStoryModal";

const Sidebar = () => {
  const { getUsers, users, selectedUser, isUsersLoading } = useChatStore();
  const { logout, authUser } = useAuthStore();
  const { stories } = useStoryStore();
  const [showAddContact, setShowAddContact] = useState(false);
  const [showCreateStory, setShowCreateStory] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const filteredUsers = users.filter(user =>
    user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phone.includes(searchTerm)
  );

  if (isUsersLoading) {
    return (
      <div className="w-80 bg-white dark:bg-gray-800 border-r border-gray-100 dark:border-gray-700 flex flex-col h-full">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <img src="/logo.png" alt="Orango" className="w-8 h-8" />
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Orango</h1>
            </div>
            <div className="flex items-center space-x-2">
              <div className="skeleton h-8 w-8 rounded-lg"></div>
              <div className="skeleton h-8 w-8 rounded-lg"></div>
              <div className="skeleton h-8 w-8 rounded-lg"></div>
              <div className="skeleton h-8 w-8 rounded-lg"></div>
            </div>
          </div>
          <div className="skeleton h-10 w-full rounded-lg"></div>
        </div>
        <div className="flex-1 p-4">
          <div className="space-y-3">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex items-center space-x-3 p-4">
                <div className="skeleton h-12 w-12 rounded-full"></div>
                <div className="flex-1">
                  <div className="skeleton h-4 w-32 mb-2"></div>
                  <div className="skeleton h-3 w-24"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-white dark:bg-gray-800 border-r border-gray-100 dark:border-gray-700 flex flex-col h-full">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <img src="/logo.png" alt="Orango" className="w-8 h-8" />
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Orango</h1>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowAddContact(true)}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-primary-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <UserPlus className="w-5 h-5" />
            </button>
            <button
              onClick={() => setShowCreateStory(true)}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-primary-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
            <Link
              to="/settings"
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-primary-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <Settings className="w-5 h-5" />
            </Link>
            <button
              onClick={logout}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search contacts..."
            className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 border-0 rounded-lg focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {stories.length > 0 && (
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Stories</h2>
          <StoryList stories={stories} />
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
        <ContactList users={filteredUsers} selectedUser={selectedUser} />
      </div>

      {showAddContact && (
        <AddContactModal onClose={() => setShowAddContact(false)} />
      )}

      {showCreateStory && (
        <CreateStoryModal onClose={() => setShowCreateStory(false)} />
      )}
    </div>
  );
};

export default Sidebar;