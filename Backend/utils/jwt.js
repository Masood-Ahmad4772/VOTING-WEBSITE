import jwt from "jsonwebtoken";
import User from "../models/user.model.js";


export const protectRoute = async (req,res,next) => {
  try {
    const token = req.cookies.jwt
    if(!token){
      return res.status(400).json({msg: "please login to acces this route"})
    }
    const decode = jwt.verify(token, process.env.JWT_SECRET)
    // console.log("docode jwt:",decode)

    if(!decode){
      return res.status(401).json({msg: "unauthorized"})
    }

    const user = await User.findById(decode.userId)
    console.log("user is:", user)
    
    if(!user) return res.status(400).json({msg: "user not found"})
      req.user = user;
      next()
  } catch (error) {
    console.log("error in protectRoutes", error.message)
    res.status(500).json({msg: "Internal server error"})
  }
}

export const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
};
