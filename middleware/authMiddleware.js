const jwt = require("jsonwebtoken");
const userAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return next("Login to continue");
  }
  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, "hihihi");
    req.user = { userId: payload.userId };
    next();
  } catch (e) {
    return next("auth failed");
  }
};
module.exports = userAuth;
