import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
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

    const token = jwt.sign({ id: user._id }, process.env.jwt, {
      expiresIn: "5d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      expires: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    });
    res.status(201).json({
      message: "User registered successfully.",
      status: "success",
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
      token,
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

    const token = jwt.sign({ id: user._id }, process.env.jwt, {
      expiresIn: "5d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      expires: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    });
    res.status(201).json({
      message: "User registered successfully.",
      status: "success",
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });

    console.log(error);
  }
};
export default { userRegisterController, userLoginController };
