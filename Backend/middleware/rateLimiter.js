const rateLimit = require("express-rate-limit");
const { RedisStore } = require("rate-limit-redis");
const redisClient = require("../config/redis.js");

const generalLimiter = rateLimit({
    windowMs : 15 * 60 * 1000,
    max : 100,
    message : {
        error : "To many request From this IP"
    },
    standardHeaders: true,
    legacyHeaders: false,
    store: new RedisStore({
        prefix: "rl:general:",
        sendCommand: (...args) => redisClient.call(...args),
    }),
});

const authLimitter = rateLimit({
    windowMs : 15 * 60 * 1000,
    max : 7 , 
    message : {
        error : "Too many login/registration attempts"
    },
    standardHeaders: true,
    legacyHeaders: false,
    store: new RedisStore({
        prefix: "rl:auth:",
        sendCommand: (...args) => redisClient.call(...args),
    }),
});


module.exports = {generalLimiter,authLimitter}
