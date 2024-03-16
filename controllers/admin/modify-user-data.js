const User = require("../../models/user");

const { CustomAPIError } = require("../../errors/custom-error");

const asyncWrapper = require("../../middleware/async");

const modifyUserData = asyncWrapper(async (req, res) => {
  const { userID, userModifiedData } = req.body;
  let modifiedData = {};

  if (userModifiedData.accountAdvert) {
    modifiedData.accountAdvert = userModifiedData.accountAdvert;
  }

  if (userModifiedData.accountSmartLink) {
    modifiedData.accountSmartLink = userModifiedData.accountSmartLink;
  }

  if (userModifiedData.accountNicheStatus) {
    modifiedData.accountNicheStatus =
      userModifiedData.accountNicheStatus;
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
