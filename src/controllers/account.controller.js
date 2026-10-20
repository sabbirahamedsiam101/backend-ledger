import AccountModel from "../models/account.model.js";

const createAccountController = async (req, res) => {
  try {
    const user = req.user; // Assuming the user is attached to the request object by the authentication middleware

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const account = await AccountModel.create({
      user: user._id,
      currency: req.body.currency,
    });
    res.status(201).json({ message: "Account created successfully", account });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });

    console.log(error);
  }
};

export default { createAccountController };
