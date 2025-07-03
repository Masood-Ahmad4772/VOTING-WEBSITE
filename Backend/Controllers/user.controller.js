import bcrypt from "bcrypt";
import cloudinary from "../utils/cloudinary.js";
import { generateToken } from "../utils/jwt.js";
import User from "../models/user.model.js";

export const signup = async (req, res) => {
  try {
    console.log(req.body)
    const { fullname, email, password, role } = req.body;

    const errors = [];
    if (password.length < 6)
      errors.push("Password must be at least 6 characters");
    if (!/[!@#$%&*(),.?":{}|<>]/.test(password))
      errors.push("Password must contain at least one special character");

    if (errors.length) {
      return res.status(400).json({ msg: errors.join(". ") });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ msg: "Email already exists" });
    }

    if (role === "admin") {
      const existingAdmin = await User.findOne({ role: "admin" });
      if (existingAdmin) {
        return res.status(400).json({ msg: "Only one admin is allowed" });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ fullname, email, password: hashedPassword, role });

    await newUser.save();
    generateToken(newUser._id, res);

    res.status(201).json({
      _id: newUser._id,
      fullname: newUser.fullname,
      email: newUser.email,
      role: newUser.role,
    });
  } catch (error) {
    console.error("Error in signup controller:", error.message);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};



export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ msg: "Invalid Email" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(400).json({ msg: "Incorrect password" });

    generateToken(user._id, res);

    res.status(200).json({
      _id: user._id,
      email: user.email,
    });
  } catch (error) {
    console.error("Error in login controller:", error.message);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};


export const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ msg: "logOut Successfully" });
  } catch (error) {
    console.log("error in logout Controler", error.message);
    res.status(500).json({ msg: "internal server error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user.id;

    if (!profilePic) {
      return res.status(400).json({ msg: "please update your ProfilePic" });
    }
    const uploadResponse = await cloudinary.uploader
      .upload(profilePic)
      .catch((err) => {
        console.error("Cloudinary upload error:", err.msg);
        return res
          .status(500)
          .json({ msg: "Failed to upload image to Cloudinary" });
      });

    if (!uploadResponse) return;
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url },
      { new: true }
    );
    console.log("profile is updated");
    res.status(200).json(updatedUser);
  } catch (error) {
   console.error("Error in updateProfile Controller:", error);

    res.status(500).json({ msg: "failed to update the password" });
  }
};

export const check = async (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("error in check-auth-Controller", error.message);
    res.status(500).json({ msg: "internal server Error", error:error.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    return res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ msg: "Internal server error" });
  }
};


// cnic verification

export const verifyCNIC = async (req, res) => {
  try {
    const { userId, cnic, cnicFront, cnicBack } = req.body;
  
    const uploadCnicFront = await cloudinary.uploader.upload(cnicFront).catch((err) => {
      console.error("Cloudinary upload error:", err.msg);
      return res
        .status(500)
        .json({ msg: "Failed to upload image to Cloudinary" });
    });
    const uploadCnicBack = await cloudinary.uploader.upload(cnicBack).catch((err) => {
      console.error("Cloudinary upload error:", err.msg);
      return res
        .status(500)
        .json({ msg: "Failed to upload image to Cloudinary" });
    });

    if (!uploadCnicBack) return;
    if (!uploadCnicFront) return;

    const updateUser = await User.findByIdAndUpdate(
      userId,
      {
        idCardNumber: cnic,
        cnicFront: uploadCnicFront.secure_url,
        cnicBack: uploadCnicBack.secure_url,
        cnicStatus: 'pending'
      },
      {
        new: true,
      }
    );

    res.status(200).json(updateUser)
  } catch (error) {
    console.log("error in getProfile-Controller", error.msg);
    res.status(500).json({ msg: "internal server Error" });
  }
};



export const getPendingCNICs = async (req, res) => {
  try {
    const pendingUsers = await User.find({ cnicStatus: "pending" });
    res.json(pendingUsers);
  } catch (error) {
    console.log("error in getProfile-Controller", error.msg);
    res.status(500).json({ msg: "internal server Error" });
  }
}


export const ApprovedCNICS =  async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const updateuser = await User.findByIdAndUpdate(id, { cnicStatus: status });
    res.json({ msg: `CNIC ${status} successfully` });
  } catch (error) {
    console.log("error in ApprovedCNICS-Controller", error.msg);
    res.status(500).json({ msg: "internal server Error" });
  }
}

export const getusers = async (req,res) => {
  try {
    const users =  await User.find();
    res.json(users);
  } catch (error) {
    console.log("error in getdata-Controller", error.msg);
    res.status(500).json({ msg: "internal server Error" });
  }
}



// check user is voted or not



