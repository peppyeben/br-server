const User = require("../models/user");
const asyncWrapper = require("../middleware/async");
const { CustomAPIError } = require("../errors/custom-error");

const changePassword = asyncWrapper(async (req, res) => {
  const user = await User.findById(req.userId).exec();

  const { oldPassword, newPassword } = req.body;

  

  if (!user) {
    throw new CustomAPIError("User doesn't Exist", 401);
  }
});

module.exports = changePassword;
