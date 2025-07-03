import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, LogOut, Vote, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { UserStore } from "../store/UserStore";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Navbar = () => {
  const { authuser, logout } = UserStore();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const linkVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300 },
    },
    hover: { scale: 1.1, transition: { type: "spring", stiffness: 300 } },
  };

  const handleLogout = async () => {
    await logout();
    toast.success("Logout Successfully 👍");
    navigate("/");
  };

  // Determine user links based on role
  const userLinks =
    authuser?.role === "admin"
      ? ["CreateCandidate", "Candidates", "VoteCount", "Voters"]
      : ["Candidates", "VoteCount", "Voters"];

  return (
    <nav className="fixed top-0 left-0 w-full bg-gradient-to-r from-gray-700 to-gray-900 bg-opacity-80 backdrop-blur-md shadow-lg z-10">
      <div className="container mx-auto flex justify-between items-center px-6 py-4">
        {/* Logo */}
        <motion.div initial="hidden" animate="visible" variants={linkVariants}>
          <Link
            to="/"
            className="flex items-center gap-2.5 text-cyan-400 font-bold text-2xl tracking-wide hover:opacity-80 transition"
          >
            <div className="size-9 rounded-lg bg-cyan-400/10 flex items-center justify-center">
              <Vote className="w-5 h-5 text-cyan-400" />
            </div>
            Voting Web
          </Link>
        </motion.div>

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-6 items-center">
          {authuser ? (
            <>
              {userLinks.map((item, index) => (
                <motion.div
                  key={index}
                  variants={linkVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                >
                  <Link
                    to={`/${item.toLowerCase()}`}
                    className="text-white hover:text-cyan-400 transition duration-300"
                  >
                    {item}
                  </Link>
                </motion.div>
              ))}

              {/* Profile & Logout */}
              <motion.div
                variants={linkVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
              >
                <Link
                  to="/profile"
                  className="hover:text-cyan-400 btn btn-sm gap-2 text-white"
                >
                  <User className="size-5" />
                  <span className="hidden sm:inline">Profile</span>
                </Link>
              </motion.div>

              <motion.div
                variants={linkVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
              >
                <button
                  className="btn btn-sm gap-2 text-white hover:text-cyan-400"
                  onClick={handleLogout}
                >
                  <LogOut className="size-5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </motion.div>
            </>
          ) : (
            <motion.div
              variants={linkVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
            >
              <Link
                to="/login"
                className="btn btn-sm gap-2 text-2xl text-white hover:text-cyan-400"
              >
                <span className="hidden sm:inline">Login</span>
              </Link>
            </motion.div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-gray-900 bg-opacity-95 backdrop-blur-md shadow-md rounded-b-xl p-6 absolute top-full left-0 w-full"
          >
            {authuser ? (
              <>
                {userLinks.map((item, index) => (
                  <motion.div
                    key={index}
                    variants={linkVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover="hover"
                  >
                    <Link
                      to={`/${item.toLowerCase()}`}
                      className="block py-2 text-white hover:text-cyan-400"
                    >
                      {item}
                    </Link>
                  </motion.div>
                ))}
                <Link
                  to="/profile"
                  className="block py-2 text-white hover:text-cyan-400"
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="block py-2 text-white hover:text-cyan-400"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block py-2 text-white hover:text-cyan-400"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="block py-2 text-white hover:text-cyan-400"
                >
                  Signup
                </Link>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
