import User from "../models/user.model.js";
import Candidate from "../models/candidate.model.js";

const checkRole = async (userId) => {
  try {
    const user = await User.findById(userId);
    return user.role === "admin";
  } catch (error) {
    return false;
  }
};

export const createCandidate = async (req, res) => {
  try {
    if (!(await checkRole(req.user.id)))
      return res.status(400).json({ msg: "User does not have admin role" });

    const { name, party, age } = req.body; // Data fetched from frontend

    // Check if all fields are filled
    if (!name || !party || !age) {
      return res.status(400).json({ msg: "Please fill all fields" });
    }

    // Check if age is less than 20
    if (age < 20) {
      return res.status(400).json({ msg: "Age is too small for a candidate" });
    }

    // Check if party already exists
    const existingParty = await Candidate.findOne({ party });
    if (existingParty) {
      return res.status(400).json({ msg: "Party already exists" });
    }


    const newCandidate = new Candidate({
      name,
      party,
      age,
    });

    const response = await newCandidate.save();
    console.log("Candidate data is saved");
    return res
      .status(200)
      .json({ msg: "Candidate successfully created", data: response });
  } catch (error) {
    console.log("An error occurred in createCandidate", error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const updateCandidate = async (req, res) => {
  try {
    if (!(await checkRole(req.user.id)))
      return res.status(404).json({ msg: "user has not role admin" });
    const candidateId = req.params.candidateID;
    if (!candidateId)
      return res.status(400).json({ msg: "candidateId is not provided" });
    const updateCandidateData = req.body;
    const candidate = await Candidate.findByIdAndUpdate(
      candidateId,
      updateCandidateData,
      { new: true },
      { runValidators: true }
    );
    if (!candidate) return res.status(404).json({ msg: "candidate not found" });
    console.log("Candidate updated");
    return res.status(200).json(candidate);
  } catch (error) {
    console.log("error in updateCandidate ", error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const deleteCandidate = async (req, res) => {
  try {
    if (!(await checkRole(req.user.id)))
      return res.status(404).json({ msg: "User does not have admin role" });
    const candidateId = req.params.candidateID;
    if (!candidateId)
      return res.status(404).json({ msg: "candidate ID not provided" });
    const candidate = await Candidate.findByIdAndDelete(candidateId);
    if (!candidate) return res.status(404).json({ msg: "candidate not found" });
    console.log("candidate deleted");
    return res.status(200).json({ msg: "Candidate deleted successfully" });
  } catch (error) {
    console.log("error in updateCandidate ", error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

//  this function is completly working ...
export const giveVote = async (req, res) => {
  const candidateId = req.params.candidateID;
  const userId = req.user.id;

  try {
    const candidate = await Candidate.findById(candidateId);
    console.log("candidate is :", candidate); // find the data of candidate
    if (!candidate) return res.status(404).json({ msg: "candidate not found" });
    const user = await User.findById(userId); // find the data off user
    if (!user) return res.status(404).json({ msg: "user not found" });
    if (user.isvoted) {
      return res.status(400).json({ msg: "user has already voted" });
    }
    if (user.role == "admin")
      return res.status(400).json({ msg: "admin can't vote" });

    // set the candidate to voted
    candidate.votes.push({ user: userId, name: user.name });
    candidate.voteCount++;
    await candidate.save();
    console.log("candidate succefully save");

    // set user to voted
    user.isvoted = true;
    await user.save();
    console.log("user succefully save");
  } catch (error) {
    console.log("Error in the giveVote function", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

export const checkPartyVotes = async (req, res) => {
  try {
    const candidate = await Candidate.find().sort({ voteCount: "desc" });

    const voteRecord = candidate.map((data) => {
      return {
        party: data.party,
        count: data.voteCount,
      };
    });
    return res.status(200).json(voteRecord);
  } catch (error) {
    console.log("Error in the giveVote function", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

export const getCandidate = async (req, res) => {
  try {
    const candidates = await Candidate.find();
    console.log(candidates);
    return res.status(200).json(candidates);
  } catch (error) {
    console.log("Error in the getCnadidate function", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

export const getCandidateById = async (req, res) => {
  try {
    const candidateData = req.params.candidateID;
    const candidate = await Candidate.findById(candidateData);
    return res
      .status(200)
      .json({ msg: "Candidate successfully created", data: candidate });
  } catch (error) {
    console.log("Error in the getCnadidateById function", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};
