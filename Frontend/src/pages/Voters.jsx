import React, { useEffect } from "react";
import { usecandidateStore } from "../store/CandidateStore";

const Voters = () => {
  const { candidates, checkCandidates } = usecandidateStore();

  useEffect(() => {
    checkCandidates();
  }, [checkCandidates]);


  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900">
      <div className="w-full max-w-3xl bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-white text-2xl font-semibold mb-4 text-center">
          Voter List
        </h2>
        <table className="w-full border-collapse border border-gray-700">
          <thead>
            <tr className="bg-gray-700 text-white">
              <th className="py-2 px-4 border border-gray-600">Voter ID</th>
              <th className="py-2 px-4 border border-gray-600">Voter Name </th>
            </tr>
          </thead>
          <tbody>
            {/* Loop through all candidates and their votes */}
            {candidates?.length > 0 ? (
              candidates.map((candidate) =>
                candidate.votes?.length > 0 ? (
                  candidate.votes.map((vote, voteIndex) => (
                    <tr
                      key={vote._id || voteIndex}
                      className="text-white text-center bg-gray-900 hover:bg-gray-700 transition"
                    >
                      <td className="py-2 px-4 border border-gray-600">
                        {vote._id} {/* Voter ID */}
                      </td>
                      <td className="py-2 px-4 border border-gray-600">
                        {vote.name} {/* Voter Name */}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr key={candidate._id}>
                    <td
                      colSpan="2"
                      className="text-center text-gray-400 py-4 border border-gray-600"
                    >
                      No Voters for {candidate.name}
                    </td>
                  </tr>
                )
              )
            ) : (
              <tr>
                <td
                  colSpan="2"
                  className="text-center text-gray-400 py-4 border border-gray-600"
                >
                  No Candidates Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Voters;
