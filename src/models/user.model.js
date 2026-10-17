import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { ROLE_LIST, ROLES } from "../constants/roles.js";
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [200, "Name cannot exceed 200 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true, // Crucial for ledger accounting lookup
      trim: true,
      lowercase: true,
      maxlength: [254, "Email cannot exceed 254 characters"],
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Invalid Email address",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      select: false, // Hides password from queries by default for safety
    },
    role: {
      type: String,
      enum: ROLE_LIST,
      default: ROLES.USER,
    },
    systemUser: {
      type: Boolean,
      default: false,
      immutable: true,
      select: false,
    },
    status: {
      type: String,
      enum: ["ACTIVE", "SUSPENDED", "FROZEN"],
      default: "ACTIVE",
      description:
        "FROZEN stops all financial ledger postings for this user immediately.",
    },
    refreshToken: {
      type: String,
      select: false, // Never leak this to regular API calls
    },
  },
  { timestamps: true },
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }

  const hash = await bcrypt.hash(this.password, 10);
  this.password = hash;
  return;
});

userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

const userModel = mongoose.model("user", userSchema);

export default userModel;
