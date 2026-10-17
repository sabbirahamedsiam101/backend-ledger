import { ROLES } from "../constants/roles.js";
import mongoose from "mongoose";
import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import {
  clearRefreshTokenCookie,
  compareRefreshToken,
  sendTokenResponse,
  verifyRefreshToken,
} from "../utils/jwt.js";
/**
 * - user register controller
 * - POST /api/auth/register
 *  */
const userRegisterController = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const isExists = await userModel.findOne({ email });
    if (isExists) {
      return res.status(422).json({
        message: "User already exists with this email.",
        status: "failed",
      });
    }

    const user = await userModel.create({
      name,
      email,
      password,
    });

    const accessToken = await sendTokenResponse(res, user);

    res.status(201).json({
      message: "User registered successfully.",
      status: "success",
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: ROLES.USER,
      },
      accessToken,
    });
    console.log("User registered successfully.");
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });

    console.log(error);
  }
};

/**
 * - user login controller
 * - POST /api/auth/login
 *  */
const userLoginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email }).select("+password");
    if (!user) {
      return res.status(404).json({
        message: "User not found with this email.",
        status: "failed",
      });
    }

    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      return res.status(404).json({
        message: "Email and Password is not valid",
        status: "failed",
      });
    }

    if (user.status !== "ACTIVE") {
      return res.status(403).json({
        message: "This account is inactive.",
        status: "failed",
      });
    }

    const accessToken = await sendTokenResponse(res, user);

    res.status(201).json({
      message: "User Logedin successfully.",
      status: "success",
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      accessToken,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });

    console.log(error);
  }
};

const refreshAccessTokenController = async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken) {
    return res.status(401).json({
      status: "error",
      code: "REFRESH_TOKEN_MISSING",
      message: "Refresh token is missing.",
    });
  }

  let decoded;
  try {
    decoded = verifyRefreshToken(refreshToken);
  } catch (error) {
    if (
      error instanceof jwt.JsonWebTokenError ||
      error instanceof jwt.NotBeforeError
    ) {
      clearRefreshTokenCookie(res);
      return res.status(401).json({
        status: "error",
        code: error instanceof jwt.TokenExpiredError
          ? "REFRESH_TOKEN_EXPIRED"
          : "INVALID_REFRESH_TOKEN",
        message: "Refresh token is invalid or expired.",
      });
    }

    console.error("Refresh token verification failed:", error);
    return res.status(500).json({
      status: "error",
      message: "Unable to verify refresh token.",
    });
  }

  if (
    !decoded ||
    typeof decoded !== "object" ||
    decoded.type !== "refresh" ||
    typeof decoded.id !== "string" ||
    !mongoose.Types.ObjectId.isValid(decoded.id)
  ) {
    clearRefreshTokenCookie(res);
    return res.status(401).json({
      status: "error",
      code: "INVALID_REFRESH_TOKEN",
      message: "Refresh token is invalid or expired.",
    });
  }

  try {
    const user = await userModel.findById(decoded.id).select("+refreshToken");
    if (
      !user ||
      user.status !== "ACTIVE" ||
      !user.refreshToken ||
      !(await compareRefreshToken(refreshToken, user.refreshToken))
    ) {
      clearRefreshTokenCookie(res);
      return res.status(401).json({
        status: "error",
        code: "INVALID_REFRESH_TOKEN",
        message: "Refresh token is invalid or expired.",
      });
    }

    const accessToken = await sendTokenResponse(res, user);
    return res.status(200).json({
      status: "success",
      message: "Access token refreshed successfully.",
      accessToken,
    });
  } catch (error) {
    console.error("Unable to refresh access token:", error);
    return res.status(500).json({
      status: "error",
      message: "Unable to refresh access token.",
    });
  }
};

const userLogoutController = async (req, res) => {
  try {
    await userModel.updateOne(
      { _id: req.user._id },
      { $unset: { refreshToken: 1 } },
    );
    clearRefreshTokenCookie(res);
    return res.status(200).json({
      status: "success",
      message: "Logged out successfully.",
    });
  } catch (error) {
    console.error("Unable to log out user:", error);
    return res.status(500).json({
      status: "error",
      message: "Unable to log out.",
    });
  }
};

export default {
  userRegisterController,
  userLoginController,
  refreshAccessTokenController,
  userLogoutController,
};
