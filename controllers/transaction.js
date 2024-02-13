const User = require("../models/user");
const Transaction = require("../models/transactions");
// const { upload } = require("../middleware/file-upload");

const { CustomAPIError } = require("../errors/custom-error");
const asyncWrapper = require("../middleware/async");

const newUserTransaction = asyncWrapper(async (req, res) => {
  const { userTransactionType } = req.query;
  const { txAmount, txMethod } = req.body;

  console.log(req.body);
  console.log(req.file);

  if (!req.file) {
    throw new CustomAPIError("Please upload a file", 400);
  }

  const filePath = req.file.path;

  if (!["Withdrawal", "Deposit"].includes(userTransactionType)) {
    throw new CustomAPIError("Invalid userTransactionType", 400);
  }

  if (!["Bitcoin", "Ethereum", "USDT", "Bank"].includes(txMethod)) {
    throw new CustomAPIError("Invalid txMethod", 400);
  }

  const user = await User.findById(req.userId);

  if (txAmount <= 0) {
    throw new CustomAPIError("Amount must be more than zero", 400);
  }

  const newTransaction = new Transaction({
    txAmount,
    txMethod,
    txType: userTransactionType,
    paymentFile: filePath,
  });

  console.log(newTransaction);

  await newTransaction.save();

  const txId = newTransaction._id;

  user.userTransactions[userTransactionType].push(txId);

  await user.save();
  res.status(200).json({
    msg: "Transaction Added",
    plan: newTransaction,
    success: true,
  });
});

module.exports = { newUserTransaction };
