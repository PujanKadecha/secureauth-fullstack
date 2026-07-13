const redisClient = require("../config/redis");

const REFRESH_TOKEN_TTL = 7 * 24 * 60 * 60;
const refreshTokenKey = (token) => `refreshToken:${token}`;
const userTokensKey = (userId) => `userRefreshTokens:${userId}`;

const storeRefreshToken = async (token, userId) => {
  const tokenKey = refreshTokenKey(token);
  const userKey = userTokensKey(userId);

  await redisClient.set(tokenKey, userId, "EX", REFRESH_TOKEN_TTL);
  await redisClient.sAdd(userKey, token);
  await redisClient.expire(userKey, REFRESH_TOKEN_TTL);
};

const getUserIdByRefreshToken = async (token) => {
  return await redisClient.get(refreshTokenKey(token));
};

const deleteRefreshToken = async (token) => {
  const tokenKey = refreshTokenKey(token);
  const userId = await redisClient.get(tokenKey);

  await redisClient.del(tokenKey);

  if (userId) {
    await redisClient.sRem(userTokensKey(userId), token);
  }
};

const deleteRefreshTokensForUser = async (userId) => {
  const userKey = userTokensKey(userId);
  const tokens = await redisClient.sMembers(userKey);

  if (tokens?.length) {
    const tokenKeys = tokens.map((token) => refreshTokenKey(token));
    await redisClient.del(...tokenKeys);
  }

  await redisClient.del(userKey);
};

module.exports = {
  storeRefreshToken,
  getUserIdByRefreshToken,
  deleteRefreshToken,
  deleteRefreshTokensForUser,
};
