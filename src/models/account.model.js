import mongoose from "mongoose";

const accountSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
      index: true,
    },
    status: {
      type: String,
      enum: ["ACTIVE", "FROZEN", "CLOSED"],
      default: "ACTIVE",
      required: [true, "Status should be ACTIVE, FROZEN or CLOSED"],
    },
    currency: {
      type: String,
      enum: ["USD", "EUR", "GBP", "JPY", "CAD", "BDT"],
      default: "BDT",
      required: [true, "Currency should be USD, EUR, GBP, JPY, CAD or BDT"],
    },
  },
  { timestamps: true },
);

accountSchema.index({ user: 1, status: 1 });

const Account = mongoose.model("Account", accountSchema);

export default Account;
