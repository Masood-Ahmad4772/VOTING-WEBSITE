import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      require:true,
      unique: true,
    },
    idCardNumber: {
      type: String,
      sparse: true,
      default: null,
    },
    profilePic: {
      type: String,
      default: "",
    },
    cnicFront: { type: String }, // Store Cloudinary URL (uploaded later)
    cnicBack: { type: String }, // Store Cloudinary URL (uploaded later)
    cnicStatus: {
      type: String,
      enum: ["not Verified", "pending", "approved", "rejected"],
      default: "not Verified",
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["voter", "admin"],
      default: "voter",
    },
    isvoted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);

export default User;
