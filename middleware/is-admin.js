const jwt = require("jsonwebtoken");
const { CustomAPIError } = require("../errors/custom-error");
const User = require("../models/user");

const isAdmin = async (req, res, next) => {
  const authBearer = req.headers.authorization;

  if (!authBearer || !authBearer.startsWith("Bearer ")) {
    throw new CustomAPIError("No Token Available", 401);
  }

  const token = authBearer.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("decoded", decoded);
    const { userId } = decoded;

    const user = await User.findById(userId);

    if (!user) {
      throw new CustomAPIError("Who Are You?!", 403);
    }

    if (!user.isAdmin) {
      throw new CustomAPIError("Admin access only", 403);
    }

    next();
  } catch (error) {
    throw new CustomAPIError(
      "Forbidden - Admin access required",
      403
    );
  }
};

module.exports = isAdmin;
