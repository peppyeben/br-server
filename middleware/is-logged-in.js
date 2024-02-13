const jwt = require("jsonwebtoken");
const { CustomAPIError } = require("../errors/custom-error");

const isLoggedIn = async (req, res, next) => {
  const authBearer = req.headers.authorization;

  if (!authBearer || !authBearer.startsWith("Bearer ")) {
    throw new CustomAPIError("No Token Available", 401);
  }

  const token = authBearer.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    console.log("decoded", decoded);
    next();
  } catch (error) {
    throw new CustomAPIError(
      "Forbidden - You have to be Logged in",
      403
    );
  }
};

module.exports = isLoggedIn;
