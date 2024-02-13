const mongoose = require("mongoose");

const calculateReturns = require("../../utils/calculate-returns");

const PremiumGrowthPlanSchema = new mongoose.Schema({
  name: { type: String, default: "PremiumGrowthPlan" },
  growthRate: { type: Number, default: 138 },
  currentAmount: { type: Number, default: 0 },
  investAmount: {
    type: Number,
    required: true,
    min: 10000,
    max: 999999999,
    default: 0,
    validate: {
      validator: function (value) {
        return value >= 10000 && value <= 999999999;
      },
      message:
        "Investment amount must be between 10000 and 999999999",
    },
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  isActive: { type: Boolean, default: true },
  activeHours: { type: [Number], default: [] },
  startTime: { type: Date, default: Date.now() },
  pauseTime: { type: Date, default: null },
});

PremiumGrowthPlanSchema.methods.updateCurrentAmount = function () {
  this.currentAmount = calculateReturns(
    this.startTime,
    this.investAmount,
    this.activeHours,
    this.growthRate,
    this.isActive
  );

  return this.save();
};

PremiumGrowthPlanSchema.methods.pause = function () {
  if (this.isActive) {
    this.pauseTime = new Date().getTime();
    this.activeHours.push(
      Math.floor(
        (this.pauseTime - new Date(this.startTime).getTime()) /
          (60 * 60 * 1000)
      )
    );

    this.pauseTime = new Date(this.pauseTime).toISOString();

    this.isActive = false;
    this.startTime = null;
  }

  return this.save();
};

PremiumGrowthPlanSchema.methods.resume = function () {
  if (!this.isActive) {
    this.startTime = new Date().getTime();
    this.pauseTime = null;
    this.isActive = true;

    this.startTime = new Date(this.startTime).toISOString();
  }

  return this.save();
};

const PremiumGrowthPlan = mongoose.model(
  "PremiumGrowthPlan",
  PremiumGrowthPlanSchema
);

module.exports = PremiumGrowthPlan;
