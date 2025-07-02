import { useEffect, useState } from "react";
import { usecandidateStore } from "../store/CandidateStore";
import { UserStore } from "../store/UserStore";
import { toast } from "react-hot-toast";
import { LoaderPinwheel } from "lucide-react";
import EditModel from "../pages/EditModel";


const Candidate = () => {
  const { candidates, checkCandidates, voteCandidate, deleteCandidate, getCandidateById } =
    usecandidateStore();
  const [hasvoted, sethasvoted] = useState(false);
  const [isOpenEdit, setIsOpenEdit] = useState(false)
  const [selectCandidate, setSelectCandidate] = useState(null)
  const { authuser, isCheckingAuth} = UserStore();

  useEffect(() => {
    checkCandidates();
  }, [checkCandidates]);
  useEffect(() => {
    // console.log("authuse is:",authuser)
  }, [authuser]);


  //  handle the vote 🖖
  const handleVote = async (id) => {
    try {
      await voteCandidate(id);
      await authuser() 
      // Manually update authuser state
      UserStore.setState((state) => ({
        authuser: { ...state.authuser, isvoted: true },
      }));
      toast.success("You have voted successfully");
      checkUser();
      sethasvoted(true);
    } catch (error) {
      console.log("Error voting:", error);
      toast.error("Error voting! Please try again.");
    }
  };
  
  

  // Handle delete button ❌
  const handleDelete = async (id) => {
    try {
      await deleteCandidate(id);
      checkCandidates(); // ✅ Refresh the list
       toast.success("Deleted successfully ❌")
    } catch (error) {
      console.log("Error deleting candidate:", error);
      toast.error(error.response?.data?.msg || "An error occurred");
    }
  };

  const handleEdit = async (id) => {
    const candidateData = await getCandidateById(id)
    setSelectCandidate(candidateData)
    setIsOpenEdit(true)
  }


  

  if (isCheckingAuth && !authuser)
    return (
      <div className="flex items-center justify-center h-screen bg-zinc-700">
        <LoaderPinwheel className="size-20 animate-spin " />
      </div>
    );

  return (
    <div className="min-h-screen w-full bg-gray-900 text-white flex flex-col items-center justify-center p-6 relative">
      <div className="mt-12 w-full max-w-4xl">
        <h2 className="text-3xl font-semibold text-center text-blue-400 mb-6">
          Meet the Candidates
        </h2>

        {authuser.role === "admin" ? (
          // Admin sees candidate list with Edit and Delete buttons
          <div className="w-full">
            {Array.isArray(candidates) && candidates.length > 0 ? (
              <div className="grid sm:grid-cols-2 gap-6 w-full">
                {candidates.map((c, i) => (
                  <div
                    key={i}
                    className="p-6 bg-gray-800 rounded-lg shadow-md text-center transition-all duration-300 hover:shadow-xl hover:bg-gray-700"
                  >
                    <h3 className="text-2xl font-bold text-white">{c.name}</h3>
                    <p className="text-gray-400 text-lg mt-1">{c.party}</p>
                    <div className="mt-6 flex gap-4 justify-center">
                      <button className="flex items-center gap-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-lg shadow-md transition-all duration-300"
                      onClick={() => handleEdit(c._id)}
                      >
                        Edit
                      </button>

                      <button
                        className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg shadow-md transition-all duration-300"
                        onClick={() => handleDelete(c._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="w-full flex justify-center items-center mt-6">
                <h2 className="text-center text-gray-400 text-2xl font-semibold">
                  No Candidates Available
                </h2>
              </div>
            )}
          </div>
        ) : authuser.cnicStatus === "approved" ? (
          authuser.isvoted ? (
            // Regular User - Already Voted
            <h2 className="text-center text-gray-400 text-2xl font-semibold">
              ✅ You have already voted!
            </h2>
          ) : (
            // Regular User - Can Vote
            <div className="grid sm:grid-cols-2 gap-6">
              {candidates ? (
                candidates.map((c, i) => (
                  <div
                    key={i}
                    className="p-6 bg-gray-900 bg-opacity-80 rounded-2xl shadow-lg backdrop-blur-md text-center transition-all duration-300 hover:shadow-xl hover:bg-opacity-90 border border-gray-700"
                  >
                    {/* Candidate Name */}
                    <h3 className="text-3xl font-bold text-white">{c.name}</h3>
                    <p className="text-gray-400 text-lg mt-1">{c.party}</p>
                    <p className="text-gray-300 text-sm mt-2">
                      Votes: {c.voteCount}
                    </p>

                    {/* Vote Button */}
                    <button
                      className={`mt-6 px-5 py-3 text-lg font-semibold rounded-xl transition-all duration-300 shadow-md ${
                        authuser.isvoted
                          ? "bg-gray-500 cursor-not-allowed text-white"
                          : "bg-green-500 hover:bg-green-600 text-white"
                      }`}
                      onClick={() => handleVote(c._id)}
                      disabled={hasvoted}
                    >
                      {authuser.isvoted ? "✅ Voted" : "🗳️ Vote Now"}
                    </button>
                  </div>
                ))
              ) : (
                <h2 className="text-center text-gray-400">
                  No Candidates Available
                </h2>
              )}
            </div>
          )
        ) : (
          // Regular User - Not Verified
          <div className="text-center text-yellow-400 text-xl font-semibold mt-6">
            🚫 Please verify your account
            <h1>
              {" "}
              your acount is{" "}
              <span
                className={`${
                  authuser.cnicStatus === "not Verified"
                    ? "text-blue-400"
                    : authuser.cnicStatus === "pending"
                    ? "text-yellow-300"
                    : authuser.cnicStatus === "approved"
                    ? "text-green-500"
                    : "text-red-600"
                } text-center  text-2xl  `}
              >
                {authuser.cnicStatus}
              </span>
            </h1>
          </div>
        )}
      </div>

      {isOpenEdit && <EditModel isOpenModel={isOpenEdit}  setIsOpenModel={setIsOpenEdit} candidate={selectCandidate}  />}

      {/* Footer */}
      <footer className="mt-12 text-gray-400 absolute bottom-4">
        <p>
          &copy; {new Date().getFullYear()} Voting Portal. All Rights Reserved.
        </p>
      </footer>
    </div>
  );
};

export default Candidate;
