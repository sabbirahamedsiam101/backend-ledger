import AccountModel from "../models/account.model.js";

/**
 * - create account controller
 * - POST /api/accounts/create
 *  */
const createAccountController = async (req, res) => {
  try {
    const user = req.user; // Assuming the user is attached to the request object by the authentication middleware

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const account = await AccountModel.create({
      user: user._id,
      currency: req?.body?.currency,
    });
    res.status(201).json({ message: "Account created successfully", account });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });

    console.log(error);
  }
};

const getAllAccountsController = async (req, res) => {
  try {
    const user = req.user; // Assuming the user is attached to the request object by the authentication middleware

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const accounts = await AccountModel.find({ user: user._id });
    res
      .status(200)
      .json({ message: "Accounts retrieved successfully", accounts });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });

    console.log(error);
  }
};
export default { createAccountController, getAllAccountsController };
