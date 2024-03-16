const User = require("../models/user");
const niches = require("../utils/niches");

const { CustomAPIError } = require("../errors/custom-error");

const asyncWrapper = require("../middleware/async");

function isNotEmpty(obj) {
  return Object.keys(obj).length !== 0;
}

const modifyUserData = asyncWrapper(async (req, res) => {
  const userID = req.userId;
  const userModifiedData = req.body;
  let modifiedData = {};

  if (userModifiedData.accountSmartLink == "Pending") {
    modifiedData.accountSmartLink = "Pending";
  }

  if (userModifiedData.accountSmartLink == "Inactive") {
    modifiedData.accountSmartLink = "Inactive";
  }
  
  if (userModifiedData.accountAdvert == "Pending") {
    modifiedData.accountAdvert = "Pending";
  }

  if (userModifiedData.accountAdvert == "Inactive") {
    modifiedData.accountAdvert = "Inactive";
  }

  if (
    userModifiedData.accountNiche &&
    !niches.includes(userModifiedData.accountNiche) &&
    userModifiedData.accountNiche != "cancel"
  ) {
    throw new CustomAPIError(
      `Invalid Niche Selected ${userModifiedData.accountNiche}`,
      404
    );
  }

  if (userModifiedData.accountNiche) {
    if (userModifiedData.accountNiche == "cancel") {
      modifiedData.accountNiche = "";
    } else {
      modifiedData.accountNiche = userModifiedData.accountNiche;
    }
  }
  // if (userModifiedData.accountNiche) {
  // }
  if (!isNotEmpty(modifiedData)) {
    throw new CustomAPIError(`Can't modify empty object`, 404);
  }

  const user = await User.findOneAndUpdate(
    { _id: userID },
    { $set: modifiedData },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!user) {
    throw new CustomAPIError(`No user with ID: ${userID}`, 404);
  }

  res.status(200).json({ user });
});

module.exports = modifyUserData;
