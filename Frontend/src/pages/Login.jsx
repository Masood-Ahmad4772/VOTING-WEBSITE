import React, { useState } from "react";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { Link } from "react-router-dom";

import toast, { Toaster } from "react-hot-toast";
import "react-toastify/dist/ReactToastify.css";

import { motion } from "framer-motion";
import { UserStore } from "../store/UserStore";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { login } = UserStore();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    toast.dismiss();
    if (!formData.email || !formData.password) {
      return toast.error("Please fill in all fields");
    }
    if (!formData.email.trim()) return toast.error("Email is required");
    if (!formData.password) return toast.error("Password is required");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm() === true) {
      const response = await login(formData);
      if (response) Navigate("/dashboard"); // Redirect only after a successful login

    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white px-4">
      <Toaster position="top-right" reverseOrder={false} />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-gray-800 p-8 rounded-2xl shadow-2xl max-w-md w-full space-y-6"
      >
        <h1 className="text-4xl font-extrabold text-center text-blue-500">
          Login
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Input */}
          <motion.div whileFocus={{ scale: 1.05 }}>
            <label className="block mb-2 text-gray-300">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-400" />
              <input
                type="email"
                name="email"
                className="w-full bg-gray-700 text-white px-4 py-3 pl-10 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
          </motion.div>

          {/* Password Input */}
          <motion.div whileFocus={{ scale: 1.05 }}>
            <label className="block mb-2 text-gray-300">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                className="w-full bg-gray-700 text-white px-4 py-3 pl-10 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleInputChange}
              />
              <button
                type="button"
                className="absolute right-3 top-3 text-gray-400"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </motion.div>

          {/* Login Button with Animation */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full bg-blue-600 py-3 rounded-lg text-white font-bold text-lg transition transform hover:bg-blue-700"
            type="submit"
          >
            Login
          </motion.button>
        </form>

        {/* Signup Link */}
        <p className="text-center text-gray-400">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-blue-400 hover:text-blue-300 hover:cursor-pointer"
          >
            Sign up
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
