import React, { useEffect, useState } from "react";
import { X, IdCard } from "lucide-react";
import toast, {Toaster} from "react-hot-toast";
import { UserStore } from "../store/UserStore";

const ShowModel = ({ isModalOpen, setIsModalOpen }) => {
  const [uploadcnic, setUploadCnic] = useState(false)
  const [cnic, setCnic] = useState("");
  const [cnicFront, setCnicFront] = useState(null);
  const [cnicBack, setCnicBack] = useState(null);

  const { authuser, submitCnic } = UserStore();

  const handleImageUpload = async (e, setImage) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => {
      setImage(reader.result); // Store Base64 in state
    };
  };
  useEffect(() => {
   console.log("authuser is coming", authuser)
  }, [authuser])
  
  const handleVerifySubmit = async (e) => {
    e.preventDefault();
    toast.dismiss("error-toast");
  
    if (!cnic || !cnicFront || !cnicBack) {
      return toast.error("Please fill all fields and upload images!", { id: "cnic-length-toast" });
    }
  
    setUploadCnic(true); // Set uploading state
  
    const formData = {
      userId: authuser?._id,
      cnic,
      cnicFront,
      cnicBack,
    };
  
    try {
      await submitCnic(formData);
      toast.success("CNIC uploaded successfully!");
    } catch (error) {
      console.error("Error uploading CNIC:", error);
      toast.error("Failed to upload CNIC. Please try again.");
    } finally {
      setUploadCnic(false); // Reset uploading state
    }
  
    setCnic("");
    setCnicFront(null);
    setCnicBack(null);
    setIsModalOpen(false);
  };
  

  return (
    <>
      {isModalOpen && (
        <div className="fixed inset-0 pt-16 bg-black bg-opacity-40 z-20 flex items-center justify-center">
          <div className="bg-zinc-900  text-white p-6 rounded-lg w-96 shadow-lg relative">
            <button
              className="absolute top-2 right-2 text-gray-400"
              onClick={() => setIsModalOpen(false)}
            >
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-semibold mb-4">Verify CNIC</h2>
            <p className="text-sm text-gray-400 mb-4">
              Enter your CNIC number and upload front & back images.
            </p>

            <input
              type="text"
              placeholder="Enter CNIC"
              value={cnic}
              onChange={(e) => setCnic(e.target.value)}
              className="w-full p-2 mb-4 rounded-md bg-zinc-800 border border-zinc-700"
            />

            {/* Front Image Upload */}
            <label className="block mb-4 cursor-pointer">
              <span className="text-sm">Upload CNIC Front</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, setCnicFront)}
                className="hidden"
              />
              <div className="flex items-center justify-center mt-2 border border-zinc-700 p-2 rounded-md bg-zinc-800">
                {cnicFront ? (
                  <span>✅ Uploaded</span>
                ) : (
                  <IdCard className="size-10 text-base-200" />
                )}
              </div>
            </label>

            {/* Back Image Upload */}
            <label className="block mb-4 cursor-pointer">
              <span className="text-sm">Upload CNIC Back</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, setCnicBack)}
                className="hidden"
              />
              <div className="flex items-center justify-center mt-2 border border-zinc-700 p-2 rounded-md bg-zinc-800">
                {cnicBack ? (
                  <span>✅ Uploaded</span>
                ) : (
                  <IdCard className="size-10 text-base-200" />
                )}
              </div>
            </label>

            <button
              onClick={handleVerifySubmit}

              className={`mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md w-full transition-all ${uploadcnic ? "animate-pulse pointer-events-none" : ""}`}
              disabled={uploadcnic}
            >
              {uploadcnic ? "Uploading..." : "Upload"}
            </button>
          </div>
          <Toaster position="top-right" reverseOrder={false} />
        </div>
      )}
    </>
  );
};

export default ShowModel;
