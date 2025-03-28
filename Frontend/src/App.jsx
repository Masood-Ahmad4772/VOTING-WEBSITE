import React, { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import { ToastContainer, Bounce, toast } from "react-toastify";


import Navbar from "./Components/Navbar";
import { LoaderPinwheel } from "lucide-react";
import Login from "./pages/Login";
import { UserStore } from "./store/UserStore";
import Signup from "./pages/Signup";
import LandingPage from "./pages/LandingPage";
import Candidate from "./Components/Candidates";
import Profile from "./pages/Profile";

import AdminDashboard from "./pages/AdminDashboard";
import VoteCount from "./pages/VoteCount";
import Voters from "./pages/Voters";
import CreateCandidate from "./pages/CreateCandidate";

const App = () => {
  const { authuser, checkUser, isCheckingAuth } = UserStore();

  useEffect(() => {
    checkUser();
  }, [checkUser]);

  if (!checkUser && !authuser)
    return (
      <div className="flex items-center justify-center h-screen bg-zinc-700">
        <LoaderPinwheel className="size-20 animate-spin " />
      </div>
    );

  return (
    <>
    <Navbar />
    <div className="pt-12">
      <ToastContainer
        position="top-center"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Bounce}
      />
      <Routes>
        <Route
          path="/"
          element={
            authuser?.role === "admin" ? <AdminDashboard /> : <LandingPage />
          }
        />
        <Route
          path="/profile"
          element={authuser ? <Profile /> : <Navigate to={"/"} />}
        />
        <Route
          path="/login"
          element={!authuser ? <Login /> : <Navigate to="/profile" />}
        />
        <Route
          path="/signup"
          element={!authuser ? <Signup /> : <Navigate to="/candidates" />}
        />
        <Route path="/votecount" element={<VoteCount />} />
        <Route path="/voters" element={<Voters />} />
        <Route path="/createcandidate" element={<CreateCandidate />} />
        <Route path="/candidates" element={<Candidate />} />
      </Routes>
      </div>
    </>
  );
};

export default App;
