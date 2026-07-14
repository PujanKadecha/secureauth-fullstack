const rateLimit = require("express-rate-limit");
const { RedisStore } = require("rate-limit-redis");
const redisClient = require("../config/redis.js");

const generalLimiter = rateLimit({
    windowMs : 15 * 60 * 1000,
    max : 300,
    message : {
        error : "Too many requests from this IP. Please try again shortly."
    },
    standardHeaders: true,
    legacyHeaders: false,
    passOnStoreError: true,
    store: new RedisStore({
        prefix: "rl:general:",
        sendCommand: (...args) => redisClient.call(...args),
    }),
});

const authLimitter = rateLimit({
    windowMs : 15 * 60 * 1000,
    max : 20,
    message : {
        error : "Too many login/registration attempts. Please wait 15 minutes and try again."
    },
    standardHeaders: true,
    legacyHeaders: false,
    passOnStoreError: true,
    store: new RedisStore({
        prefix: "rl:auth:",
        sendCommand: (...args) => redisClient.call(...args),
    }),
});


module.exports = {generalLimiter,authLimitter}
