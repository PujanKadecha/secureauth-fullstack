const jwt = require("jsonwebtoken");
require("dotenv").config();
const redisClient = require("../config/redis.js");

const JWT_KEY = process.env.JWT_KEY;
const REFRESH_KEY = process.env.REFRESH_KEY;

const REFRESH_TTL_SECONDS = 7 * 24 * 60 * 60; // matches the 7d refresh token expiry
const REFRESH_KEY_PREFIX = "session:refresh:";

const generateAccessToken = (user, expiresIn = "20m") => {
  return jwt.sign({ id: user._id, role: user.role }, JWT_KEY, { expiresIn });
};

const generateRefreshToken = (user, expiresIn = "7d") => {
  return jwt.sign({ id: user._id, role: user.role }, REFRESH_KEY, {
    expiresIn,
  });
};

// Cache the refresh token in Redis so it can be validated/revoked instantly
// without hitting Mongo on every request.
const cacheRefreshToken = async (token, userId) => {
  await redisClient.set(
    `${REFRESH_KEY_PREFIX}${token}`,
    String(userId),
    "EX",
    REFRESH_TTL_SECONDS,
  );
};

// Fast path check - if this returns false the token has already been logged
// out / revoked, even if it hasn't expired yet according to its JWT payload.
const isRefreshTokenActive = async (token) => {
  const exists = await redisClient.exists(`${REFRESH_KEY_PREFIX}${token}`);
  return exists === 1;
};

const revokeRefreshToken = async (token) => {
  await redisClient.del(`${REFRESH_KEY_PREFIX}${token}`);
};

const generateAuthTokens = async (user) => {
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  user.refreshToken.push(refreshToken);
  await user.save();

  await cacheRefreshToken(refreshToken, user._id);

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
  cacheRefreshToken,
  isRefreshTokenActive,
  revokeRefreshToken,
};
