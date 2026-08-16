import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { ArrowLeft, Camera } from "lucide-react";
import { Link } from "react-router-dom";

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);

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

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Link
            to="/settings"
            aria-label="Back to settings"
            className="p-2 -ml-2 rounded-md text-muted hover:text-foreground hover:bg-surface-secondary transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-bold text-foreground">Profile</h1>
        </div>

        <div className="bg-surface rounded-lg border border-border shadow-sm p-8">
          <div className="flex flex-col items-center">
            <div className="relative">
              <img
                src={selectedImg || authUser.profilePic || "/avatar.png"}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-primary-soft"
              />
              <label
                htmlFor="avatar-upload"
                className={`absolute bottom-0 right-0 bg-primary hover:bg-primary-hover p-2 rounded-full cursor-pointer transition-colors ${
                  isUpdatingProfile ? "animate-pulse pointer-events-none" : ""
                }`}
              >
                <Camera className="w-5 h-5 text-white" />
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

            {isUpdatingProfile && (
              <p className="text-xs text-muted mt-2">Uploading...</p>
            )}
          </div>

          <div className="mt-8 space-y-5">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Full Name
              </label>
              <p className="w-full px-3.5 py-2.5 bg-surface-secondary border border-border rounded-lg text-foreground text-sm">
                {authUser?.fullName}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Phone Number
              </label>
              <p className="w-full px-3.5 py-2.5 bg-surface-secondary border border-border rounded-lg text-foreground text-sm">
                {authUser?.phone}
              </p>
            </div>
          </div>

          <div className="mt-6 bg-primary-soft border border-primary/20 rounded-lg p-4">
            <h3 className="text-sm font-medium text-primary mb-1">
              Account Information
            </h3>
            <p className="text-sm text-primary/80">
              Your profile information is used to identify you in the chat. You can update your profile picture anytime.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
