import Ledger from "../models/ledger.model.js";
import Transection from "../models/transection.model.js";
import Account from "../models/account.model.js";
import emailService from "../services/email.service.js";

/**

** - Create a new transaction
* THE 10-STEP TRANSFER FLOW:
  1. Validate request
  2. Validate idempotency key
  3. Check account status
  4. Derive sender balance from ledger
  5. Create transaction (PENDING)
  6. Create DEBIT ledger entry
  7. Create CREDIT ledger entry
  8. Mark transaction COMPLETED
  9. Commit MongoDB session
  10. Send email notification

- Create a new transaction

*/

const createTransectionController = async (req, res) => {
  // Step 1: Validate request start
  const { fromAccount, toAccount, amount, idempotencyKey } = req.body;
  if (!fromAccount || !toAccount || !amount || !idempotencyKey) {
    return res
      .status(400)
      .json({ message: "Missing required Data in request. Check again" });
  }

  const fromAccountData = await Account.findById({ _id: fromAccount });
  if (!fromAccountData) {
    return res.status(404).json({ message: "From Account not found" });
  }
  const toAccountData = await Account.findById({ _id: toAccount });
  if (!toAccountData) {
    return res.status(404).json({ message: "To Account not found" });
  }

  // Step 1: Validate request end

  // Step 2: Validate idempotency key start
  
  // Step 2: Validate idempotency key end
  try {
  } catch (error) {
    console.error("Error creating transaction:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default {
  createTransectionController,
};
