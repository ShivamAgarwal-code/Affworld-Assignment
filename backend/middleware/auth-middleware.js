const jwt = require("jsonwebtoken");
const User = require("../model/User");

const authMiddleware = async (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res
      .status(401)
      .json({ msg: "Unauthorized HTTP, Token not provided" });
  }
  const jwtToken = token.replace("Bearer", "").trim();
  try {
    const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET_KEY);
    const userData = await User.findOne({ email: decoded.email }).select({
      password: 0,
    });
    req.user = userData;
    req.token = jwtToken;
    req.userId = userData._id;
    next();
  } catch (error) {
    return res.status(401).json({ msg: "Unauthorized, Invalid Token." });
  }
};

module.exports = authMiddleware;
