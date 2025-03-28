import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


import { usecandidateStore } from "../store/CandidateStore";
import { useNavigate } from "react-router-dom";

const CreateCandidate = () => {
  const [formData, setFormData] = useState({
    name: "",
    party: "",
    age: "",
  });
  const { Createcandidates,  AddingCandidate } = usecandidateStore();
const Navigate = useNavigate()

  const ValidateForm = () => {
  toast.dismiss();
  if (!formData.name.trim()) {
    toast.error("Name is required", { id: "name-length-toast" });
    return false;
  }
  if (!formData.party.trim()) {
    toast.error("Party is required", { id: "party-length-toast" });
    return false;
  }
  if (!formData.age.trim()) {
    toast.error("Age is required", { id: "age-length-toast" });
    return false;
  }

  if (formData.age < 20) {
    toast.error("age is greater than 20", { id: "age-length-toast" })
  }


  return true;
};


  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!ValidateForm()) return;
    await Createcandidates(formData);
    toast.success("Candidate added successfully!");
    Navigate("/candidates"); // Or any success page
  };
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-6">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gray-800 p-8 rounded-xl shadow-lg max-w-md w-full"
      >
        <h2 className="text-3xl text-white font-bold text-center mb-6">
          Add Candidate
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-gray-400">Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter candidate name"
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-md outline-none focus:ring-2 focus:ring-blue-400"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div>
            <label className="text-gray-400">Party</label>
            <input
              type="text"
              name="party"
              placeholder="Enter party name"
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-md outline-none focus:ring-2 focus:ring-blue-400"
              value={formData.party}
              onChange={(e) => setFormData({ ...formData, party: e.target.value })}
            />
          </div>

          <div>
            <label className="text-gray-400">Age</label>
            <input
              type="number"
              name="age"
              placeholder="Enter age"
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-md outline-none focus:ring-2 focus:ring-blue-400"
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: e.target.value })}
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`w-full bg-blue-500 hover:bg-blue-600 text-white    font-bold py-2 px-4 rounded-md transition`}
            type="submit"
            disabled={AddingCandidate}
          >
            { AddingCandidate ? (
              <>
                <Loader2 className="inline-block animate-spin mr-2" />
                Adding...
              </>
            ) : (
              "Add Candidate"
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default CreateCandidate;
