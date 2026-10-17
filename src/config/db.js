import mongoose from "mongoose";

const connectToDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("The Database Is Connected");
  } catch (error) {
    console.error("Error on connecting BD", error);
    process.exit(1);
  }
};

export default connectToDB;
