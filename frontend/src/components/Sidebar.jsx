import { useEffect, useState, useMemo } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { useStoryStore } from "../store/useStoryStore";
import { Settings, LogOut, Plus, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";
import ContactList from "./ContactList";
import StoryList from "./StoryList";
import AddContactModal from "./AddContactModal";
import CreateStoryModal from "./CreateStoryModal";
import AppLogo from "./ui/AppLogo";
import IconButton from "./ui/IconButton";
import SearchInput from "./ui/SearchInput";

const FILTERS = [
  { key: "all", label: "All" },
  { key: "unread", label: "Unread" },
];

const Sidebar = () => {
  const { getUsers, users, selectedUser, isUsersLoading } = useChatStore();
  const { logout } = useAuthStore();
  const { stories } = useStoryStore();
  const [showAddContact, setShowAddContact] = useState(false);
  const [showCreateStory, setShowCreateStory] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const filteredUsers = useMemo(() => {
    return users
      .filter((user) =>
        user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone.includes(searchTerm)
      )
      .filter((user) => (activeFilter === "unread" ? user.unreadCount > 0 : true));
  }, [users, searchTerm, activeFilter]);

  if (isUsersLoading) {
    return (
      <div className="w-full bg-surface border-r border-border flex flex-col h-full">
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <AppLogo />
            <div className="flex items-center space-x-1">
              <div className="skeleton h-8 w-8"></div>
              <div className="skeleton h-8 w-8"></div>
              <div className="skeleton h-8 w-8"></div>
              <div className="skeleton h-8 w-8"></div>
            </div>
          </div>
          <div className="skeleton h-10 w-full"></div>
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
    <div className="w-full bg-surface border-r border-border flex flex-col h-full">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <AppLogo />
          <div className="flex items-center space-x-1">
            <IconButton icon={UserPlus} label="Add contact" onClick={() => setShowAddContact(true)} />
            <IconButton icon={Plus} label="Create story" onClick={() => setShowCreateStory(true)} />
            <Link
              to="/settings"
              aria-label="Settings"
              title="Settings"
              className="p-2 rounded-md text-muted hover:text-foreground hover:bg-surface-secondary transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <Settings className="w-5 h-5" />
            </Link>
            <IconButton icon={LogOut} label="Logout" onClick={logout} />
          </div>
        </div>

        <SearchInput
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search contacts..."
        />

        <div className="flex items-center gap-1 mt-3 bg-surface-secondary rounded-lg p-1">
          {FILTERS.map((filter) => (
            <button
              key={filter.key}
              onClick={() => setActiveFilter(filter.key)}
              className={`flex-1 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors duration-150 ${
                activeFilter === filter.key
                  ? "bg-surface text-primary shadow-sm"
                  : "text-muted hover:text-foreground"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {stories.length > 0 && (
        <div className="p-4 border-b border-border">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-muted mb-3">Stories</h2>
          <StoryList stories={stories} />
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-2 py-2">
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
