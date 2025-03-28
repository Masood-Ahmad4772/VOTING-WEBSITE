import React, { useEffect, useState } from "react";
import { User, Camera, ShieldCheck, LoaderPinwheel } from "lucide-react";
import { UserStore } from "../store/UserStore";
import ShowModel from "../pages/ShowModel";

const Profile = () => {
  const [selectedImg, setSelectedImg] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { authuser, isCheckingAuth, isUpdatingProfile, updateprofile, checkUser } = UserStore();

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      await updateprofile({ profilePic: base64Image });
      await checkUser();
    };
  };

  useEffect(() => {
    console.log("authuser is:", authuser);
  }, [authuser]);

  if (isCheckingAuth || !authuser)
    return (
      <div className="h-screen flex items-center justify-center bg-zinc-700">
        <LoaderPinwheel className="size-20 animate-spin " />
      </div>
    );

  return (
    <div className="min-h-screen flex flex-col items-center py-10 bg-gray-900 overflow-hidden">
      <div className="max-w-lg w-full bg-zinc-900 text-white rounded-2xl shadow-xl p-6 space-y-4">
        <div className="flex flex-col items-center gap-2">
          <div className="relative">
            <img
              src={selectedImg || authuser.profilePic || "/avatar.png"}
              alt="profile"
              className="size-28 rounded-full object-cover border-4"
            />
            <label
              htmlFor="avatar-upload"
              className={`absolute bottom-0 right-0 bg-base-content hover:scale-105
                p-2 rounded-full cursor-pointer transition-all duration-200
                ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}`}
            >
              <Camera className="w-5 h-5 text-base-200" />
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
          <p className="text-sm text-zinc-400">
            {isUpdatingProfile ? "Uploading..." : "Click the camera icon to update your photo"}
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-1">
            <div className="text-sm text-zinc-400 flex items-center gap-2">
              <User className="w-4 h-4" />
              Full Name
            </div>
            <p className="px-4 py-1.5 bg-zinc-800 rounded-lg border border-zinc-700">
              {authuser.name}
            </p>
          </div>
        </div>

        <div className="bg-zinc-800 rounded-xl p-4">
          <h2 className="text-lg font-medium mb-4">Account Information</h2>
          <div className="space-y-1 text-sm">
            <div className="flex items-center justify-between py-2 border-b border-zinc-700">
              <span>Account Status</span>
              <span className="text-green-400">Active</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-zinc-700">
              <span>Member Since</span>
              <span>{authuser.createdAt?.split("T")[0]}</span>
            </div>
          </div>
        </div>

        {/* Verification Button */}
        {authuser.role !== "admin" && (
          <div className="flex flex-col items-center space-y-2">
            {authuser.cnicStatus === "approved" ? (
              <button className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center gap-2" disabled>
                <ShieldCheck className="w-5 h-5" />
                Verified ✅
              </button>
            ) : authuser.cnicStatus === "pending" ? (
              <button className="bg-yellow-500 text-white px-4 py-2 rounded-lg flex items-center gap-2" disabled>
                <ShieldCheck className="w-5 h-5" />
                Pending ⏳
              </button>
            ) : (
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-all"
                onClick={() => setIsModalOpen(true)}
              >
                <ShieldCheck className="w-5 h-5" />
                Not Verified ❌
              </button>
            )}
          </div>
        )}
      </div>

      <ShowModel isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
    </div>
  );
};

export default Profile;
