const rateLimit = require("express-rate-limit");

const userLoginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3,
  keyGenerator: (req) => req.body.email,   
  message: {
    error: "Too many login attempts from this email. Please try again later."
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { userLoginLimiter };