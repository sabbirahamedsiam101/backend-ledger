import mongoose from "mongoose";

const ledgerSchema = new mongoose.Schema(
  {
    account: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      required: [true, "Account is required"],
      index: true, // Index for faster queries on account
      immutable: true, // Ledger entries should not change the associated account
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0, "Amount must be a positive number"],
      immutable: true,
    },
    transection: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Transection",
      required: [true, "Transection is required"],
      index: true, // Index for faster queries on transection
      immutable: true, // Ledger entries should not change the associated transection
    },
    type: {
      type: String,
      enum: ["DEBIT", "CREDIT"],
      required: [true, "Type is required"],
      immutable: true, // Ledger entries should not change the type
    },
  },
  { timestamps: true },
);

const preventLedgerModification = function (next) {
  throw new Error(
    "Ledger entries are immutable and cannot be modified  or deleted.",
  );
};

ledgerSchema.pre("findOneAndUpdate", preventLedgerModification);
ledgerSchema.pre("findOneAndReplace", preventLedgerModification);
ledgerSchema.pre("findOneAndDelete", preventLedgerModification);
ledgerSchema.pre("updateOne", preventLedgerModification);
ledgerSchema.pre("updateMany", preventLedgerModification);
ledgerSchema.pre("deleteOne", preventLedgerModification);
ledgerSchema.pre("deleteMany", preventLedgerModification);
ledgerSchema.pre("remove", preventLedgerModification);

const LedgerModel = mongoose.model("Ledger", ledgerSchema);

export default LedgerModel;
