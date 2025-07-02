import { create } from "zustand";
import { axiosCandidate } from "../utils/axios.js";
import {toast} from "react-hot-toast";

export const usecandidateStore = create((set, get) => ({
  candidates: null,
  voterRecord: [],
  AddingCandidate: false,



  
Createcandidates: async (candidate) => {
    try {
      const res = await axiosCandidate.post("/", candidate);
      toast.success(res.data.msg || "data Successfuly Created")
    } catch (error) {
      console.eroor("eror in createcandidate", error.response.data.msg || error.msg)
      toast.error(res.response.data.msg || "an error occur")
    }
  },
  
  checkCandidates: async () => {
    try {
      const res = await axiosCandidate.get("/candidate");
      set({ candidates: res.data });
    } catch (error) {
      console.log("error in SignUp", error);
      toast.error(error.response?.data?.msg) || "An error Occur";
    }
  },

  voteCandidate: async (candidateID) => {
    // console.log("candidate id is: ", candidateID);
    try {
      await axiosCandidate.post(`/vote/${candidateID}`);
      toast.success(res.data.msg || "Vote costed successfully!");
    } catch (error) {
      console.log("error in Votecandidate", error);
      toast.error(error.response?.data?.msg) || "An error Occur";
    }
  },


  VotersRecord: async() => {
    try{
        const res = await axiosCandidate.get("/vote/count");
        set({voterRecord: res.data})
    }catch{
      console.log("error in VoterRecord", error);
      toast.error(error.response?.data?.msg) || "An error Occur";
    }
  },


  deleteCandidate: async (id) => {
    console.log("Attempting to delete candidate with ID:", id);
    try {
      const res = await axiosCandidate.delete(`/${id}`);
      console.log("Server Response:", res.data); // ✅ Check if response exists
      toast.success(res.data.msg || "Candidate deleted successfully"); // 🔥 This should work
      return res.data;
    } catch (error) {
      console.log("Error in deleteCandidate:", error);
      toast.error(error.response?.data?.msg || "An error occurred");
      throw error; // ✅ Allow `handleDelete` to catch it
    }
  },


  getCandidateById: async (id) => {
    try {
      const res = await axiosCandidate.get(`/candidate/${id}`);
      return res.data;
    } catch (error) {
      console.log("error in getCandidateByid", error);
      toast.error(error.response?.data?.msg) || "An error Occur";
    }
  },
  

  updateCandidate: async(id, candidate) => {
    console.log("id of candidate", id ,"update candidate is ", candidate);
      try {
        const res = await axiosCandidate.put(`/${id}`, candidate);
        console.log("Server Response:", res.data); // ✅ Check if response exists
        toast.success("Candidate updated successfully")
      } catch (error) {
        console.log("error in getCandidateByid", error);
        toast.error(error.response?.data?.msg) || "An error Occur";
      }
  }


}));
