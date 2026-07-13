const crypto = require("crypto");
const redisClient = require("../config/redis.js");

const CODE_TTL_SECONDS = 60;
const KEY_PREFIX = "oauth:code:";

const createOAuthCode = async (payload) => {
  const code = crypto.randomBytes(32).toString("hex");

  await redisClient.set(
    `${KEY_PREFIX}${code}`,
    JSON.stringify(payload),
    "EX",
    CODE_TTL_SECONDS,
  );

  return code;
};

const consumeOAuthCode = async (code) => {
  const key = `${KEY_PREFIX}${code}`;

  
  const raw = await redisClient.getdel(key);
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

module.exports = { createOAuthCode, consumeOAuthCode };
