import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// 1. Get the directory name of the current file (src/config)
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// 2. Go up two levels to find the root .env file
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

export const env = {
  MONGO_URI: process.env.MONGO_URI,
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  NODE_ENV: process.env.NODE_ENV,
  CLIENT_ID: process.env.CLIENT_ID,
  CLIENT_SECRET: process.env.CLIENT_SECRET,
  REFRESH_TOKEN: process.env.REFRESH_TOKEN,
  EMAIL_USER: process.env.EMAIL_USER,
};

if (!env.JWT_ACCESS_SECRET || !env.JWT_REFRESH_SECRET) {
  throw new Error("Missing critical JWT environment variables in .env file.");
}
