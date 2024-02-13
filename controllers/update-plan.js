const asyncWrapper = require("../middleware/async");
const BasicGrowthPlan = require("../models/growth-plans/basic");
const StarterGrowthPlan = require("../models/growth-plans/starter");
const BronzeGrowthPlan = require("../models/growth-plans/bronze");
const GoldGrowthPlan = require("../models/growth-plans/gold");
const PremiumGrowthPlan = require("../models/growth-plans/premium");
const VIPPlan = require("../models/vip-plans/vip");
const { CustomAPIError } = require("../errors/custom-error");

const modelMapping = {
  BasicGrowthPlan: BasicGrowthPlan,
  StarterGrowthPlan: StarterGrowthPlan,
  BronzeGrowthPlan: BronzeGrowthPlan,
  GoldGrowthPlan: GoldGrowthPlan,
  PremiumGrowthPlan: PremiumGrowthPlan,
  VIPPlan: VIPPlan,
};

const updatePlan = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const { planType, growthRate, maxInvestAmount, isActive } =
    req.query;

  if (!planType || (!growthRate && !maxInvestAmount)) {
    throw new CustomAPIError("Invalid input", 400);
  }

  const Model = modelMapping[planType];

  if (!Model) {
    throw new CustomAPIError(`Invalid planType: ${planType}`, 400);
  }
  const plan = await Model.findById(id);

  const updateObj = {};

  if (growthRate) {
    updateObj.growthRate = parseFloat(growthRate);
  }
  const planStatus = await plan.isActive;

  if (planStatus.toString() != isActive.toString()) {
    if (isActive == "true") {
      await plan.resume();
    }

    if (isActive == "false") {
      await plan.pause();
    }
  }

  await plan.updateCurrentAmount();
  const userPlan = await Model.updateOne(
    { _id: id },
    { $set: updateObj }
  );

  res.status(200).json({ msg: "Success", userPlan, updateObj });
});

module.exports = updatePlan;
