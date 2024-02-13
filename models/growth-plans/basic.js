const mongoose = require("mongoose");

const calculateReturns = require("../../utils/calculate-returns");

const BasicGrowthPlanSchema = new mongoose.Schema({
  name: { type: String, default: "BasicGrowthPlan" },
  growthRate: { type: Number, default: 138 },
  currentAmount: { type: Number, default: 0 },
  investAmount: {
    type: Number,
    required: true,
    min: 500,
    max: 5000,
    default: 0,
    validate: {
      validator: function (value) {
        return value >= 500 && value <= 5000;
      },
      message: "Investment amount must be between 500 and 5000",
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

BasicGrowthPlanSchema.methods.updateCurrentAmount = function () {
  this.currentAmount = calculateReturns(
    this.startTime,
    this.investAmount,
    this.activeHours,
    this.growthRate,
    this.isActive
  );

  return this.save();
};

BasicGrowthPlanSchema.methods.pause = function () {
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

BasicGrowthPlanSchema.methods.resume = function () {
  if (!this.isActive) {
    this.startTime = new Date().getTime();
    this.pauseTime = null;
    this.isActive = true;

    this.startTime = new Date(this.startTime).toISOString();
  }

  return this.save();
};

const BasicGrowthPlan = mongoose.model(
  "BasicGrowthPlan",
  BasicGrowthPlanSchema
);

module.exports = BasicGrowthPlan;
