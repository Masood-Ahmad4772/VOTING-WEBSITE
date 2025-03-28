import { create } from "zustand";
import { axiosInstance } from "../utils/axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const UserStore = create((set, get) => ({
  authuser: null,
  users:null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  isGettingUser: false,


  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/signup", data);
      
      // ✅ Update authuser state with the new cnicStatus
      set((state) => ({
        authuser: { 
          ...res.data, 
          cnicStatus: res.data.cnicStatus || "not Verified"  // Set cnicStatus immediately after signup
        }
      }));
      
      toast.success("Account Created Successfully");
    } catch (error) {
      console.error(
        "Error in SignUp:",
        error.response?.data?.msg || error.message
      );
      toast.error(error.response?.data?.msg || "An error occurred");
    } finally {
      set({ isSigningUp: false });
    }
  },


  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/login", data);
      
      // ✅ Ensure cnicStatus is updated on login
      set((state) => ({
        authuser: { 
          ...res.data, 
          cnicStatus: res.data.cnicStatus || "not Verified"  
        }
      }));
      
      toast.success("Login Successfully");
    } catch (error) {
      console.error("Error in login:", error.response?.data?.msg || error.message);
      toast.error(error.response?.data?.msg || "An error occurred");
    } finally {
      set({ isLoggingIn: false });
    }
  },



  checkUser: async () => {
    set({ isCheckingAuth: true });
    try {
      const res = await axiosInstance.get("/profile");
      set({ authuser: res.data });
    } catch (error) {
      console.error("not data fetching", error.response?.data?.msg ||error.message);
      set({ authuser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  getUser: async () => {
    set({isGettingUser : true});
    try {
      const res = await axiosInstance.get("/getusers", data);
      set({user: res.data});
    } catch (error) {
      console.log("error in Logout", error);
      toast.error(error.response.data.msg);
    } finally{
      set({isGettingUser : false});
    }
  },


  logout: async () => {
    try {
      toast.dismiss("error-toast");
      await axiosInstance.post("/logout");
      set({ authuser: null });
    } catch (error) {
      console.log("error in Logout", error);
      toast.error(error.response.data.msg);
    }
  },
  
  updateprofile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      toast.dismiss("error-toast");
      const res = await axiosInstance.put("/updateprofile", data);
      set({ authuser: res.data });
      toast.success("profileupdated successfully", { id: "cnic-length-toast" });
    } catch (error) {
      console.log("eroor in update profile:", error);
      toast.error(error.response.data.msg);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  submitCnic: async (formData) => {
    try {
      toast.dismiss("error-toast");
      const res = await axiosInstance.post("/verify-cnic", formData, {});
      toast.success(res.data.msg || "CNIC submitted successfully!", {
        id: "cnic-length-toast",
      });
    } catch (error) {
      toast.error("Error submitting CNIC. Please try again.");
      console.error(error);
    }
  },

  fetchPendingCNICs: async () => {
    try {
      const res = await axiosInstance.get("/pending-cnics");
      console.log("Fetched CNICs:", res.data); // ✅ Log response
      return res.data;
    } catch (error) {
      console.error("Error fetching CNICs:", error);
      toast.error("Error fetching CNICs");
      return [];
    }
  },
  verifyCNIC: async (id, status) => {
    try {
      const res = await axiosInstance.put(`/approved-cnics/${id}`, { status });
    } catch (error) {
      toast.error("Error updating CNIC status");
    }
  },

}));
