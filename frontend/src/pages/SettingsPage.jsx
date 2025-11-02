import { useState, useEffect } from "react";
import { useThemeStore } from "../store/useThemeStore";
import { useAuthStore } from "../store/useAuthStore";
import { ArrowLeft, Moon, Sun, Shield, User, Camera, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import Avatar from "../components/Avatar";

const SettingsPage = () => {
  const { theme, setTheme } = useThemeStore();
  const { authUser, updateProfile, isUpdatingProfile } = useAuthStore();
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
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
    setIsLoading(true);
    try {
      await axiosInstance.post(`/contacts/unblock/${userId}`);
      setBlockedUsers(blockedUsers.filter(user => user._id !== userId));
      toast.success("User unblocked successfully");
    } catch (error) {
      toast.error("Failed to unblock user");
    } finally {
      setIsLoading(false);
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
    <div className="min-h-screen bg-white dark:bg-gray-900 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center mb-8">
          <Link to="/" className="mr-4">
            <ArrowLeft className="w-6 h-6 text-gray-600 dark:text-gray-400" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
        </div>

        <div className="space-y-6">
          {/* Profile Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <div className="flex flex-col items-center">
              <div className="relative mb-4">
                <Avatar 
                  src={selectedImg || authUser.profilePic} 
                  name={authUser.fullName} 
                  size="w-24 h-24"
                  className="border-4 border-primary-500"
                />
                <label
                  htmlFor="avatar-upload"
                  className={`absolute bottom-0 right-0 bg-primary-500 hover:bg-primary-600 p-2 rounded-full cursor-pointer transition-all duration-200 ${
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
              
              <h3 className="font-semibold text-gray-900 dark:text-white text-lg">{authUser?.fullName}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{authUser?.email}</p>
              
              <div className="flex space-x-3">
                {authUser?.profilePic && (
                  <button
                    onClick={removeProfilePic}
                    className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg transition duration-200"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Remove</span>
                  </button>
                )}
                <Link
                  to="/profile"
                  className="flex items-center space-x-2 bg-primary-500 hover:bg-primary-600 text-white px-3 py-2 rounded-lg transition duration-200"
                >
                  <User className="w-4 h-4" />
                  <span>Edit Profile</span>
                </Link>
              </div>
              
              {isUpdatingProfile && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Updating...</p>
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {theme === "light" ? (
                  <Sun className="w-5 h-5 text-yellow-500 mr-3" />
                ) : (
                  <Moon className="w-5 h-5 text-blue-500 mr-3" />
                )}
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Theme</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Choose your preferred theme
                  </p>
                </div>
              </div>
              <button
                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg transition duration-200"
              >
                {theme === "light" ? "Dark" : "Light"}
              </button>
            </div>
          </div>



          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <div className="flex items-center mb-4">
              <Shield className="w-5 h-5 text-red-500 mr-3" />
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Blocked Users</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Manage blocked contacts
                </p>
              </div>
            </div>
            
            {blockedUsers.length === 0 ? (
              <p className="text-gray-600 dark:text-gray-400">No blocked users</p>
            ) : (
              <div className="space-y-3">
                {blockedUsers.map((user) => (
                  <div key={user._id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center">
                      <Avatar 
                        src={user.profilePic} 
                        name={user.fullName} 
                        size="w-10 h-10"
                        className="mr-3"
                      />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{user.fullName}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{user.phone}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => unblockUser(user._id)}
                      disabled={isLoading}
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm transition duration-200 disabled:opacity-50"
                    >
                      Unblock
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;