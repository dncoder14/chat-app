import { useState, useEffect } from "react";
import { useThemeStore } from "../store/useThemeStore";
import { useAuthStore } from "../store/useAuthStore";
import { ArrowLeft, Sun, Moon, Monitor, Shield, User, Camera, Trash2, Info } from "lucide-react";
import { Link } from "react-router-dom";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import Avatar from "../components/Avatar";
import SettingsSection from "../components/ui/SettingsSection";
import SettingsRow from "../components/ui/SettingsRow";
import EmptyState from "../components/ui/EmptyState";

const THEME_OPTIONS = [
  { key: "light", label: "Light", icon: Sun },
  { key: "dark", label: "Dark", icon: Moon },
  { key: "system", label: "System", icon: Monitor },
];

const SettingsPage = () => {
  const { theme, setTheme } = useThemeStore();
  const { authUser, updateProfile, isUpdatingProfile } = useAuthStore();
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [unblockingId, setUnblockingId] = useState(null);
  const [selectedImg, setSelectedImg] = useState(null);

  useEffect(() => {
    fetchBlockedUsers();
  }, []);

  const fetchBlockedUsers = async () => {
    try {
      const res = await axiosInstance.get("/contacts/blocked");
      setBlockedUsers(res.data);
    } catch (error) {
      toast.error("Failed to fetch blocked users");
    }
  };

  const unblockUser = async (userId) => {
    setUnblockingId(userId);
    try {
      await axiosInstance.post(`/contacts/unblock/${userId}`);
      setBlockedUsers(blockedUsers.filter((user) => (user._id || user.id) !== userId));
      toast.success("User unblocked successfully");
    } catch (error) {
      toast.error("Failed to unblock user");
    } finally {
      setUnblockingId(null);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      await updateProfile({ profilePic: base64Image });
    };
  };

  const removeProfilePic = async () => {
    try {
      await updateProfile({ profilePic: "" });
      setSelectedImg(null);
      toast.success("Profile picture removed");
    } catch (error) {
      toast.error("Failed to remove profile picture");
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Link
            to="/"
            aria-label="Back"
            className="p-2 -ml-2 rounded-md text-muted hover:text-foreground hover:bg-surface-secondary transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-bold text-foreground">Settings</h1>
        </div>

        <div className="space-y-6">
          {/* Profile Section */}
          <div className="bg-surface rounded-lg border border-border shadow-sm p-6">
            <div className="flex flex-col items-center">
              <div className="relative mb-4">
                <Avatar
                  src={selectedImg || authUser.profilePic}
                  name={authUser.fullName}
                  size="w-24 h-24"
                  className="border-4 border-primary-soft"
                />
                <label
                  htmlFor="avatar-upload"
                  className={`absolute bottom-0 right-0 bg-primary hover:bg-primary-hover p-2 rounded-full cursor-pointer transition-colors ${
                    isUpdatingProfile ? "animate-pulse pointer-events-none" : ""
                  }`}
                >
                  <Camera className="w-4 h-4 text-white" />
                  <input
                    type="file"
                    id="avatar-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isUpdatingProfile}
                  />
                </label>
              </div>

              <h3 className="font-semibold text-foreground text-lg">{authUser?.fullName}</h3>
              <p className="text-sm text-muted mb-4">{authUser?.email}</p>

              <div className="flex gap-3">
                {authUser?.profilePic && (
                  <button
                    onClick={removeProfilePic}
                    className="flex items-center gap-2 text-sm bg-danger/10 text-danger hover:bg-danger/20 px-3 py-2 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Remove</span>
                  </button>
                )}
                <Link
                  to="/profile"
                  className="flex items-center gap-2 text-sm bg-primary hover:bg-primary-hover text-white px-3 py-2 rounded-lg transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span>Edit Profile</span>
                </Link>
              </div>

              {isUpdatingProfile && (
                <p className="text-xs text-muted mt-2">Updating...</p>
              )}
            </div>
          </div>

          <SettingsSection title="Appearance">
            <div className="px-5 py-4">
              <p className="text-sm font-medium text-foreground mb-0.5">Theme</p>
              <p className="text-xs text-muted mb-3">Choose your preferred appearance</p>
              <div className="grid grid-cols-3 gap-2">
                {THEME_OPTIONS.map(({ key, label, icon: Icon }) => (
                  <button
                    key={key}
                    onClick={() => setTheme(key)}
                    className={`flex flex-col items-center justify-center gap-1.5 py-3 rounded-lg text-xs font-medium border transition-colors ${
                      theme === key
                        ? "border-primary bg-primary-soft text-primary"
                        : "border-border text-muted hover:text-foreground hover:bg-surface-secondary"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </SettingsSection>

          <SettingsSection title="Blocked Users">
            {blockedUsers.length === 0 ? (
              <EmptyState
                icon={Shield}
                title="No blocked users"
                description="Users you block will appear here"
              />
            ) : (
              blockedUsers.map((user) => {
                const userId = user._id || user.id;
                return (
                  <div key={userId} className="flex items-center justify-between px-5 py-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <Avatar src={user.profilePic} name={user.fullName} size="w-10 h-10" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{user.fullName}</p>
                        <p className="text-xs text-muted truncate">{user.phone}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => unblockUser(userId)}
                      disabled={unblockingId === userId}
                      className="text-xs font-medium text-success bg-success/10 hover:bg-success/20 px-3 py-1.5 rounded-md transition-colors disabled:opacity-50 shrink-0"
                    >
                      {unblockingId === userId ? "Unblocking..." : "Unblock"}
                    </button>
                  </div>
                );
              })
            )}
          </SettingsSection>

          <SettingsSection>
            <SettingsRow
              icon={Info}
              title="About Orango"
              description="Version 1.0.0"
            />
          </SettingsSection>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
