const mongoose = require("mongoose");
const User = require("./user");
const { CustomAPIError } = require("../errors/custom-error");

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
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

TransactionSchema.virtual("userId")
  .get(function () {
    return this._userId;
  })
  .set(function (userId) {
    this._userId = userId;
  });

TransactionSchema.pre("save", async function (next) {
  try {
    const userId = this.userId;

    const user = await User.findById(userId);

    if (!user.isAccountVerified) {
      throw new CustomAPIError("Verification Fee not paid", 400);
    }

    if (!user.isCommissionFeePaid) {
      throw new CustomAPIError("Commission Fee not paid", 400);
    }

    if (!user.isAccountUpgraded) {
      throw new CustomAPIError("Account Upgrade Fee not paid", 400);
    }

    if (!user.isIMCPaid) {
      throw new CustomAPIError(
        "Investment Management Charges Not paid",
        400
      );
    }

    if (!user.isAccountUpdated) {
      throw new CustomAPIError("Account Update Fee not paid", 400);
    }

    if (!user.isAMCPaid) {
      throw new CustomAPIError(
        "Account Maintenance Fee not paid",
        400
      );
    }

    if (!user.isReflectionFeePaid) {
      throw new CustomAPIError("Reflection Fee not paid", 400);
    }

    if (!user.isRecommitmentFeePaid) {
      throw new CustomAPIError("Recommitment Fee not paid", 400);
    }

    if (!user.isSpreadFeePaid) {
      throw new CustomAPIError("Spread Fee not paid", 400);
    }

    if (!user.isDistributionFeePaid) {
      throw new CustomAPIError("Distribution Fee not paid", 400);
    }

    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model("Transaction", TransactionSchema);
