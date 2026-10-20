import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import userModel from "../models/user.model.js";
import { verifyAccessToken } from "../utils/jwt.js";

// export const protectRoute = async (req, res, next) => {
//   const authorization = req.headers.authorization;
//   const match = authorization?.match(/^Bearer\s+(\S+)$/i);

//   if (!match) {
//     return res.status(401).json({
//       status: "error",
//       message: "Not authorized, access token missing.",
//     });
//   }

//   let decoded;
//   try {
//     decoded = verifyAccessToken(match[1]);
//   } catch (error) {
//     if (
//       error instanceof jwt.JsonWebTokenError ||
//       error instanceof jwt.NotBeforeError
//     ) {
//       return res.status(401).json({
//         status: "error",
//         code: error instanceof jwt.TokenExpiredError ? "TOKEN_EXPIRED" : "INVALID_TOKEN",
//         message:
//           error instanceof jwt.TokenExpiredError
//             ? "Access token expired."
//             : "Access token is invalid.",
//       });
//     }

//     console.error("Access token verification failed:", error);
//     return res.status(500).json({
//       status: "error",
//       message: "Unable to verify access token.",
//     });
//   }

//   if (
//     !decoded ||
//     typeof decoded !== "object" ||
//     typeof decoded.id !== "string" ||
//     !mongoose.Types.ObjectId.isValid(decoded.id)
//   ) {
//     return res.status(401).json({
//       status: "error",
//       code: "INVALID_TOKEN",
//       message: "Access token is invalid.",
//     });
//   }

//   try {
//     const user = await userModel.findById(decoded.id);
//     if (!user || user.status !== "ACTIVE") {
//       return res.status(401).json({
//         status: "error",
//         message: "User session is invalid or inactive.",
//       });
//     }

//     req.user = user;
//     return next();
//   } catch (error) {
//     console.error("Unable to load authenticated user:", error);
//     return res.status(500).json({
//       status: "error",
//       message: "Unable to authenticate user.",
//     });
//   }
// };

const authenticate = async (req, res, next) => {
  const token = req.cookies?.token || req.headers?.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({
      status: "error",
      message: "Unauthorized access , token is missing.",
    });
  }
  try {
    const decoded = verifyAccessToken(token);
    const user = await userModel.findById(decoded.id);
    req.user = user;
    return next();
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(401).json({
      status: "error",
      message: "Unauthorized access , token is invalid.",
    });
  }
};

export default authenticate;
