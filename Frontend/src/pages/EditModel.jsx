import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { usecandidateStore } from "../store/CandidateStore";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditModel = ({ isOpenModel, setIsOpenModel, candidate }) => {
const { updateCandidate,  checkCandidates } = usecandidateStore();

  const [formData, setFormData] = useState({ name: "", party: "", age: "" });

  useEffect(() => {
    // console.log("Candidate Data: ", candidate); // Debugging line
    if (candidate?.data && isOpenModel) {
      setFormData({
        name: candidate?.data.name || "",
        party: candidate?.data.party || "",
        age: candidate?.data.age || "",
      });
    }
  }, [candidate, isOpenModel]);
 


  const handleUpdateCandidate = async (e) => {
    e.preventDefault();
    try {
        await updateCandidate(candidate?.data._id, formData);
        checkCandidates()
        setIsOpenModel(false);
        toast.success("Candidate updated successfully")
    } catch (error) {
        console.log("error to update candidate", error);
        toast.error("Error UpdatingCandidate! Please try again.");
    }

  }


  // console.log(formData)
  return (
    <>
      {isOpenModel && (
        <div className="fixed inset-0 bg-zinc-600 bg-opacity-50 flex items-center justify-center h-screen z-100">
          <div className="bg-zinc-900 text-white p-6 rounded-lg w-96 shadow-lg relative">
            <button
              className="absolute top-2 right-2 text-gray-400"
              onClick={() => setIsOpenModel(false)}
            >
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-semibold mb-4">Edit Candidate</h2>
         

            <div>
              <label className="text-gray-400">Name</label>
              <input
                type="text"
                name="name"
                className="w-full px-4 py-2 bg-gray-700 text-white rounded-md outline-none focus:ring-2 focus:ring-blue-400"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
              />
              
            </div>
            <div>
              <label className="text-gray-400">Name</label>
              <input
                type="text"
                name="name"
                className="w-full px-4 py-2 bg-gray-700 text-white rounded-md outline-none focus:ring-2 focus:ring-blue-400"
                value={formData.party}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, party: e.target.value }))
                }
              />
              
            </div>
            <button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md w-full transition-all"
            onClick={handleUpdateCandidate}
            >
              Update
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default EditModel;
