import express from "express";
import {signup,login,logout,updateProfile, check,getProfile,getusers, verifyCNIC, getPendingCNICs, ApprovedCNICS} from "../Controllers/user.controller.js"
import { protectRoute } from "../utils/jwt.js";



const router = express.Router();


router.post("/signup", signup)
router.post("/login", login)
router.post('/logout', logout)

router.get("/profile", protectRoute, getProfile)
router.put('/updateprofile', protectRoute, updateProfile)
router.get('/check', protectRoute, check)
router.get('/getusers', protectRoute, getusers)


// cnic verification routes 
router.post("/verify-cnic",protectRoute,  verifyCNIC)
router.get("/pending-cnics", protectRoute, getPendingCNICs)
router.put('/approved-cnics/:id', protectRoute, ApprovedCNICS);



export default router