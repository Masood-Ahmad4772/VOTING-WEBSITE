import express from "express";
import { protectRoute} from "../utils/jwt.js";
import {createCandidate,updateCandidate,deleteCandidate, giveVote,checkPartyVotes,getCandidate,getCandidateById} from "../Controllers/candidate.controller.js"



const router = express.Router();

router.get("/candidate", getCandidate);
router.post("/",protectRoute, createCandidate)
router.put("/:candidateID", protectRoute, updateCandidate)
router.delete("/:candidateID", protectRoute, deleteCandidate)
router.post("/vote/:candidateID", protectRoute, giveVote);
router.get('/vote/count', checkPartyVotes)
router.get("/candidate/:candidateID", getCandidateById)


export default router