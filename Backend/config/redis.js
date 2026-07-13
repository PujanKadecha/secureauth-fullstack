const Redis = require("ioredis");
const dotenv = require("dotenv");
dotenv.config();

const REDIS_URL = process.env.REDIS_URL || "redis://127.0.0.1:6379";

const redisClient = new Redis(REDIS_URL, {
  maxRetriesPerRequest: 3,
  // Reconnect automatically with a capped backoff instead of failing hard
  retryStrategy: (times) => Math.min(times * 200, 2000),
});

redisClient.on("connect", () => {
  console.log("Redis Connected Successfully");
});

redisClient.on("error", (err) => {
  console.error("Redis Connection Error:", err.message);
});

module.exports = redisClient;
