const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const User = require("../models/users");
const mailService = require("./mail.service");
const tokenService = require("./token.service");
const redisService = require("./redis.service");
const twoFactorService = require("./twoFactor.service");
const activityService = require("./activity.service");
const AppError = require("../utils/AppError");

const register = async ({ name, email, password, confirmPassword }) => {
  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new AppError("User already exists", 400);
  }

  if (password !== confirmPassword) {
    throw new AppError("Passwords do not match", 400);
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const emailToken = crypto.randomBytes(32).toString("hex");

  const newUser = await User.create({
    name,
    email,
    password: hashedPassword,
    verificationToken: emailToken,
  });

  mailService.sendVerificationEmail(newUser, emailToken).catch((emailErr) => {
    console.error("Failed to send verification email:", emailErr.message);
  });

  await activityService.logActivity({
    userId: newUser._id,
    userEmail: newUser.email,
    action: "USER_REGISTER",
    details: "Account registered successfully. Verification email transmitted.",
  });

  return newUser;
};

const login = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError("Invalid Email or Password", 400);
  }

  if (user.lockUntil && user.lockUntil > Date.now()) {
    const remainingTime = Math.ceil((user.lockUntil - Date.now()) / 60000);
    throw new AppError(
      `Account is locked. Try again in ${remainingTime} minutes.`,
      423,
    );
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;

    if (user.failedLoginAttempts >= 5) {
      user.lockUntil = Date.now() + 15 * 60 * 1000;
      await user.save();
      throw new AppError(
        "Too many failed attempts. Account locked for 15 minutes.",
        423,
      );
    }

    await user.save();
    throw new AppError("Invalid Password", 400);
  }

  if (user.failedLoginAttempts > 0) {
    user.failedLoginAttempts = 0;
    user.lockUntil = null;
    await user.save();
  }

  if (!user.isVerified) {
    throw new AppError("Please Verify User", 401);
  }

  await activityService.logActivity({
    userId: user._id,
    userEmail: user.email,
    action: "USER_LOGIN",
    details: "User logged in successfully via forms.",
  });

  if (user.isTwoFactorEnabled) {
    return { isTwoFactorRequired: true, userId: user._id };
  }

  const { accessToken, refreshToken } =
    await tokenService.generateAuthTokens(user);

  return {
    accessToken,
    refreshToken,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isTwoFactorEnabled: user.isTwoFactorEnabled,
    },
  };
};

const logout = async (token) => {
  if (token) {
    await redisService.deleteRefreshToken(token);
  }
};

const verifyEmail = async (token) => {
  if (!token) {
    throw new AppError("Missing or Invalid Token", 400);
  }

  const user = await User.findOne({ verificationToken: token });
  if (!user) {
    throw new AppError("Invalid or Expired Token", 400);
  }

  user.isVerified = true;
  user.verificationToken = undefined;
  await user.save();

  await activityService.logActivity({
    userId: user._id,
    userEmail: user.email,
    action: "EMAIL_VERIFIED",
    details: "Email verification identity check passed successfully.",
  });

  return user;
};

const googleLogin = async (user) => {
  if (!user) {
    throw new AppError("OAuth user not found", 400);
  }

  const { accessToken, refreshToken } =
    await tokenService.generateAuthTokens(user);

  await activityService.logActivity({
    userId: user._id,
    userEmail: user.email,
    action: "USER_LOGIN_GOOGLE",
    details: "User authenticated successfully via Google OAuth.",
  });

  return { accessToken, refreshToken, user };
};

const verifyTwoFactorLogin = async ({ userId, token }) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError("User not Found", 404);
  }

  const isValid = twoFactorService.verifyToken(token, user.twoFactorSecret);
  if (!isValid) {
    throw new AppError("Invalid 2FA Verification Code", 400);
  }

  const { accessToken, refreshToken } =
    await tokenService.generateAuthTokens(user);

  return {
    accessToken,
    refreshToken,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isTwoFactorEnabled: user.isTwoFactorEnabled,
    },
  };
};

const setupTwoFactor = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError("User Not Found", 404);
  }

  const secret = twoFactorService.generateSecret();
  const qrCodeUrl = await twoFactorService.generateQrCode(user.email, secret);

  user.twoFactorSecret = secret;
  await user.save();

  return { qrCodeUrl, secret };
};

const enableTwoFactor = async (userId, token) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  const isValid = twoFactorService.verifyToken(token, user.twoFactorSecret);
  if (!isValid) {
    throw new AppError("Invalid validation code", 400);
  }

  user.isTwoFactorEnabled = true;
  await user.save();
};

const disableTwoFactor = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError("User Not Found", 404);
  }

  user.isTwoFactorEnabled = false;
  user.twoFactorSecret = "";
  await user.save();
};

module.exports = {
  register,
  login,
  logout,
  verifyEmail,
  googleLogin,
  verifyTwoFactorLogin,
  setupTwoFactor,
  enableTwoFactor,
  disableTwoFactor,
};
