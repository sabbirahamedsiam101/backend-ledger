import express from "express";
import authRouter from "./routers/auth.routers.js";
import accountRouter from "./routers/account.routes.js";
import transectionRouter from "./routers/transection.routes.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
dotenv.config();
const app = express();
app.use(express.json());
app.use(cookieParser());
app.get("/", (req, res) => {
  res.send("Hello World");
});
app.use("/api/auth", authRouter);
app.use("/api/accounts", accountRouter);
app.use("/api/transections", transectionRouter);
export default app;
