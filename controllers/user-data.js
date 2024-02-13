const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const User = require("../models/user");
// const {
//   BasicGrowthPlan,
//   StarterGrowthPlan,
// } = require("../models/growth-plans/basic");
const { CustomAPIError } = require("../errors/custom-error");
const asyncWrapper = require("../middleware/async");

// USERS

const getUserData = asyncWrapper(async (req, res, next) => {
  const { id: userID } = req.params;
  const user = await User.findOne({ _id: userID }).exec();

  if (!user) {
    return next(
      new CustomAPIError(`No user with ID: ${userID}`, 404)
    );
  }
  res.status(200).json({ user });
});

const getUserPlans = asyncWrapper(async (req, res, next) => {
  const user = await User.findById(req.userId).populate({
    path: "selectedPlans",
  });

  if (!user) {
    throw new CustomAPIError(`No user with ID: ${req.userId}`, 404);
  }

  const plans = user.selectedPlans;

  res.status(200).json({ plans });
});

const resetUserPassword = (req, res) => {
  res.send("Successfully reset password");
};

const modifyUserData = asyncWrapper(async (req, res) => {
  const { id: userID } = req.params;
  const user = await User.findOneAndUpdate(
    { _id: userID },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!user) {
    // return next(createCustomError(`No user with ID: ${userID}`, 404));
    return next(
      new CustomAPIError(`No user with ID: ${userID}`, 404)
    );
  }

  res.status(200).json({ user });
  // res.status(200).json({ id: userID, data: req.body });
});

// ADMIN

const getAllUsersData = asyncWrapper(async (req, res) => {
  console.log(req.adminDetails);
  const allUsers = await User.find({});
  res.status(200).json({
    data: allUsers,
    noOfUsers: allUsers.length,
    success: true,
  });
});

const deleteUserData = asyncWrapper(async (req, res) => {
  const { id: userID } = req.params;
  const user = await User.findOneAndDelete({ _id: userID });

  if (!user) {
    // return next(createCustomError(`No user with ID: ${userID}`, 404));
    return next(
      new CustomAPIError(`No user with ID: ${userID}`, 404)
    );
  }

  res.status(200).json({ user });
});

module.exports = {
  getUserData,
  resetUserPassword,
  modifyUserData,
  getAllUsersData,
  deleteUserData,
  getUserPlans,
};
