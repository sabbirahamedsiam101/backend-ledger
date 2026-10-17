import app from "./src/app.js";
import "dotenv/config";
import connectToDB from "./src/config/db.js";
const PORT = process.env.PORT || 3000;

await connectToDB();
app.listen(PORT, () => {
  console.log(`The server is running on port ${PORT}`);
});
