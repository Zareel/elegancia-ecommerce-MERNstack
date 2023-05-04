import mongoose from "mongoose";
import AuthRoles from "../utils/authRoles.js";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      maxLength: [32, "Name must be less than 32 chars"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Name is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minLength: [true, "Password must be atleast 8 chars"],
      select: false,
    },
    phone: {
      type: Number,
      required: [true, "Phone numner is required"],
    },
    address: {
      type: String,
      required: true,
      required: [true, "address is required"],
      trim: true,
    },
    role: {
      type: String,
      enum: Object.values(AuthRoles),
      default: AuthRoles.USER,
    },
    forgotPasswordToken: String,
    forgotPasswordExpiry: Date,
  },
  { timestamps: true }
);

// encrypt the password before saving

export default mongoose.model("User", userSchema);
