const rateLimit = require("express-rate-limit");
const { RedisStore } = require("rate-limit-redis");
const redisClient = require("../config/redis.js");

const userLoginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  keyGenerator: (req) => req.body.email,
  message: {
    error: "Too many login attempts from this email. Please wait 15 minutes and try again."
  },
  standardHeaders: true,
  legacyHeaders: false,
  passOnStoreError: true,
  store: new RedisStore({
    prefix: "rl:user-login:",
    sendCommand: (...args) => redisClient.call(...args),
  }),
});

module.exports = { userLoginLimiter };
