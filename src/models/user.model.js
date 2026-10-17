import mongoose from "mongoose";
import bcrypt from "bcrypt";
const userSchema = mongoose.Schema(
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
    // role: {
    //   type: String,
    //   enum: ["USER", "LEDGER_AUDITOR", "ADMIN"],
    //   default: "USER",
    // },
    // ,
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
  },
  { timestamps: true },
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  const hash = await bcrypt.hash(this.password, 10);
  this.password = hash;
  return next();
});
