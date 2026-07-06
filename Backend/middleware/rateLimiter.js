const rateLimit = require("express-rate-limit");

const generalLimiter = rateLimit({
    windowMs : 15 * 60 * 1000,
    max : 100,
    message : {
        error : "To many request From this IP"
    },
    standardHeaders: true,
    legacyHeaders: false
});

const authLimitter = rateLimit({
    windowMs : 15 * 60 * 1000,
    max : 15 , 
    message : {
        error : "Too many login/registration attempts"
    },
    standardHeaders: true,
    legacyHeaders: false,
});


module.exports = {generalLimiter,authLimitter}
