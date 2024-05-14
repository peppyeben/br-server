const crypto = require("crypto");
const User = require("../models/user");

const asyncWrapper = require("../middleware/async");
const { CustomAPIError } = require("../errors/custom-error");

const { sendVerificationEmail } = require("../utils/sendVerificationEmail");

const verifyEmail = asyncWrapper(async (req, res) => {
    const { accountEmail } = req.body;
    const user = await User.findOne({ accountEmail }).exec();
});

module.exports = verifyEmail;
