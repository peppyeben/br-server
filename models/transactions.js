const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema({
  txMethod: {
    type: String,
    enum: ["Bitcoin", "Ethereum", "USDT", "Bank"],
  },
  txAmount: { type: Number, required: [true, "Must provide Amount"] },
  txStatus: {
    type: String,
    enum: ["Successful", "Pending", "Failed"],
    default: "Pending",
  },
  txType: {
    type: String,
    enum: ["Withdrawal", "Deposit"],
  },
  paymentFile: {
    type: String,
    required: [true, "Payment proof is needed"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Transaction", TransactionSchema);
