const express = require("express");
const router = express.Router();
const passport = require("passport");
const authenticationToken = require("../middleware/authentication");
const { authLimitter } = require("../middleware/rateLimiter");
const { validateRegister, validateLogin } = require("../middleware/validator");
const authController = require("../controllers/auth.controller");
const { userLoginLimiter } = require("../middleware/userRateLimiter");

require("../config/passport");

router.post(
  "/register",
  authLimitter,
  validateRegister,
  authController.register,
);

router.post(
  "/login",
  authLimitter,
  userLoginLimiter,
  validateLogin,
  authController.login,
);
router.post("/logout", authController.logout);
router.get("/verify-email", authController.verifyEmail);
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  }),
);
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect:
      "https://secureauth-fullstack.vercel.app?error=oauth_failed",
    session: false,
  }),
  authController.googleCallback,
);
router.post("/2fa/verify-login", authController.verifyTwoFactorLogin);
router.post("/2fa/setup", authenticationToken, authController.setupTwoFactor);
router.post("/2fa/enable", authenticationToken, authController.enableTwoFactor);
router.post(
  "/2fa/disable",
  authenticationToken,
  authController.disableTwoFactor,
);

module.exports = router;
