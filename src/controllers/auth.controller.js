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

export default { userRegisterController };
