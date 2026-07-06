const jwt = require("jsonwebtoken");
require("dotenv").config();

const JWT_KEY = process.env.JWT_KEY;
const REFRESH_KEY = process.env.REFRESH_KEY;

const generateAccessToken = (user, expiresIn = "20m") => {
  return jwt.sign({ id: user._id, role: user.role }, JWT_KEY, { expiresIn });
};

const generateRefreshToken = (user, expiresIn = "7d") => {
  return jwt.sign({ id: user._id, role: user.role }, REFRESH_KEY, {
    expiresIn,
  });
};

const generateAuthTokens = async (user) => {
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  user.refreshToken.push(refreshToken);
  await user.save();

  return { accessToken, refreshToken };
};

const verifyAccessToken = (token) => jwt.verify(token, JWT_KEY);

const verifyRefreshToken = (token, callback) => {
  if (callback) {
    return jwt.verify(token, REFRESH_KEY, callback);
  }
  return jwt.verify(token, REFRESH_KEY);
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  generateAuthTokens,
  verifyAccessToken,
  verifyRefreshToken,
};
