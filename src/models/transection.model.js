import mongoose from "mongoose";

const transectionSchema = new mongoose.Schema({
  fromAccount: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Account",
    required: [true, "From Account is required"],
    index: true, // Index for faster queries on fromAccount
  },

  toAccount: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Account",
    required: [true, "To Account is required"],
  },
});

const TransectionModel = mongoose.model("Transection", transectionSchema);

export default TransectionModel;
