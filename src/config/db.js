import mongoose from "mongoose";

function connectToDB() {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log("The Database Is Connected");
    })
    .catch((err) => {
      console.log("Error on connecting BD");
      process.exit(1);
    });
}

export default connectToDB;
