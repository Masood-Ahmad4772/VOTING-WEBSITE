import React, { useEffect } from 'react'
import { usecandidateStore } from '../store/CandidateStore';

const VoteCount= () => {
    
    const { voterRecord, VotersRecord} = usecandidateStore()
  

  useEffect(() => {
    VotersRecord()
  }, [VotersRecord])
 

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900">
      <div className="w-full max-w-3xl bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-white text-2xl font-semibold mb-4 text-center">
          Vote Counts
        </h2>
        <table className="w-full border-collapse border border-gray-700">
          <thead>
            <tr className="bg-gray-700 text-white">
              <th className="py-2 px-4 border border-gray-600">Vote [{voterRecord.length}]</th>
              <th className="py-2 px-4 border border-gray-600">party</th>
            </tr>
          </thead>
          <tbody>
            {voterRecord.length > 0 ?  (
            voterRecord.map((voter, index) => (
              <tr key={index} className="text-white text-center bg-gray-900 hover:bg-gray-700 transition">
                <td className="py-2 px-4 border border-gray-600">{voter.count}</td>
                <td className="py-2 px-4 border border-gray-600">{voter.party}</td>
              </tr>
            ))):(
              <tr>
              <td
                colSpan="2"
                className="text-center text-gray-400 py-4 border border-gray-600"
              >
                No candidates found
              </td>
            </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};



export default VoteCount;