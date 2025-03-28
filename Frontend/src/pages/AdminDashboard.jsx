import React, { useEffect, useState } from "react";
import { UserStore } from "../store/UserStore";
import toast from "react-hot-toast";

const AdminDashboard = () => {
  const { fetchPendingCNICs, verifyCNIC } = UserStore();
  const [pendingUsers, setPendingUsers] = useState([]);


  useEffect(() => {
    const fetchCNICs = async () => {
      try {
        const users = await fetchPendingCNICs();
        setPendingUsers(users);
      } catch (error) {
        console.error("Error fetching CNICs:", error);
      }
    };
    fetchCNICs();
  }, [fetchPendingCNICs]);

  const handleVerify = async (userId, status) => {
    await verifyCNIC(userId, status);
    toast.success(`CNIC ${status} successfully`);
    setPendingUsers((prev) => prev.filter((user) => user._id !== userId));
  };

  return (
    <div className="h-screen pt-24 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white flex flex-col items-center justify-center py-12 px-6">
      <h2 className="text-3xl font-bold text-white mb-6">Admin Panel - CNIC Approvals</h2>

      {pendingUsers.length === 0 ? (
        <p className="text-lg text-gray-300">No pending CNICs at the moment.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
          {pendingUsers.map((user) => (
            <div key={user._id} className="bg-zinc-800 p-6 rounded-xl shadow-lg text-center">
              <p className="text-xl font-semibold text-white">{user.name}</p>
              <p className="text-gray-300 text-sm mt-1">CNIC: {user.idCardNumber}</p>

              <div className="flex justify-center gap-4 mt-4">
                <img
                  src={user.cnicFront}
                  alt="CNIC Front"
                  className="w-40 h-28 rounded-lg border border-gray-700 shadow-md"
                />
                <img
                  src={user.cnicBack}
                  alt="CNIC Back"
                  className="w-40 h-28 rounded-lg border border-gray-700 shadow-md"
                />
              </div>

              <div className="flex justify-between mt-6">
                <button
                  onClick={() => handleVerify(user._id, "approved")}
                  className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg shadow-md transition-all"
                >
                  ✅ Approve
                </button>
                <button
                  onClick={() => handleVerify(user._id, "rejected")}
                  className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg shadow-md transition-all"
                >
                  ❌ Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
