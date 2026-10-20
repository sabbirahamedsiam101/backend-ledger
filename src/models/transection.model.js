import mongoose from "mongoose";

const transectionSchema = new mongoose.Schema(
  {
    fromAccount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      required: [true, "From Account is required"],
      index: true, // Index for faster queries on fromAccount
    },
    // # from account: We use index : true for "fromAccount" . Because it will be used frequently in queries to find transactions related to a specific account. Indexing this field improves query performance, especially when filtering or sorting transactions by the originating account.
    toAccount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      required: [true, "To Account is required"],
    },
    status: {
      type: String,
      enum: ["PENDING", "COMPLETED", "FAILED", "REVERSED"],
      required: [
        true,
        "Status must be PENDING, COMPLETED, FAILED, or REVERSED",
      ],
      default: "PENDING",
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0, "Amount must be a positive number"],
    },
    idempotencyKey: {
      type: String,
      required: [true, "Idempotency Key is required"],
      unique: true, // Ensure idempotency key is unique
      index: true, // Index for faster queries on idempotencyKey
    },

    // # Idempotency Key: A unique key provided by the client to ensure that the same transaction is not processed multiple times. This is crucial for preventing duplicate transactions in case of network issues or retries. It always create on client side.
  },
  { timestamps: true },
); // Automatically adds createdAt and updatedAt fields

const TransectionModel = mongoose.model("Transection", transectionSchema);

export default TransectionModel;
