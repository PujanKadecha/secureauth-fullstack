const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const User = require("../models/users");
const mailService = require("./mail.service");
const tokenService = require("./token.service");
const activityService = require("./activity.service");
const AppError = require("../utils/AppError");


const getUsers = async () => {
  return User.find().select("-password");
};

const getActivityLogs = async () => {
  return activityService.getAllLogs();
};

const getUserById = async (id) => {
  const user = await User.findById(id).select("-password");
  if (!user) {
    throw new AppError("User Not Found", 404);
  }
  return user;
};

const deleteUser = async (id, requester) => {
  const userDelete = await User.findByIdAndDelete(id);
  if (!userDelete) {
    throw new AppError("User Not Found", 404);
  }

  await activityService.logActivity({
    userId: requester?.id || requester?._id,
    userEmail: requester?.email,
    action: "USER_DELETED",
    details: `Admin Deleted account belongs to : ${userDelete.email}`,
  });

  return userDelete;
};

const forgotPassword = async (email) => {
  if (!email) {
    throw new AppError("Email is required", 400);
  }

  const user = await User.findOne({ email });
  if (!user) {
    return;
  }

  const token = crypto.randomBytes(32).toString("hex");
  user.resetPasswordToken = token;
  user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
  await user.save();

  await mailService.sendPasswordResetEmail(user, token);

  await activityService.logActivity({
    userId: user._id,
    userEmail: user.email,
    action: "PASSWORD_RESET_REQUEST",
    details: "Requested a password recovery email validation link.",
  });
};

const resetPassword = async (token, password) => {
  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    throw new AppError("Password reset token is Invalid", 400);
  }

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(password, salt);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  await redisService.deleteRefreshTokensForUser(user._id.toString());

  await activityService.logActivity({
    userId: user._id,
    userEmail: user.email,
    action: "PASSWORD_RESET_SUCCESS",
    details:
      "Successfully verified token change and updated to a new account password.",
  });
};

const updateProfile = async (userId, name) => {
  if (!name || name.trim() === "") {
    throw new AppError("Name is Empty", 400);
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $set: { name: name.trim() } },
    { new: true, runValidators: true },
  ).select("-password");

  if (!updatedUser) {
    throw new AppError("User Not Found", 404);
  }

  await activityService.logActivity({
    userId: updatedUser._id,
    userEmail: updatedUser.email,
    action: "PROFILE_UPDATE",
    details: `Change Display name to : ${name.trim()}`,
  });

  return updatedUser;
};

const updateUser = async (id, body) => {
  if (body.password) {
    const salt = await bcrypt.genSalt(10);
    body.password = await bcrypt.hash(body.password, salt);
  }

  const updatedUser = await User.findByIdAndUpdate(id, body, {
    new: true,
  }).select("-password");

  if (!updatedUser) {
    throw new AppError("User Not Found", 404);
  }

  return updatedUser;
};

const refreshAccessToken = async (refreshToken) => {
  if (!refreshToken) {
    throw new AppError("Refresh token is required", 401);
  }

  try {
    tokenService.verifyRefreshToken(refreshToken);
  } catch (e) {
    await redisService.deleteRefreshToken(refreshToken);
    throw new AppError("Refresh token verification failed", 403);
  }

  const userId = await redisService.getUserIdByRefreshToken(refreshToken);
  if (!userId) {
    throw new AppError("Invalid or expired refresh token", 403);
  }

  const user = await User.findById(userId);
  if (!user) {
    await redisService.deleteRefreshToken(refreshToken);
    throw new AppError("Invalid or expired refresh token", 403);
  }

  return tokenService.generateAccessToken(user, "15m");
};


module.exports = {
  getUsers,
  getActivityLogs,
  getUserById,
  deleteUser,
  forgotPassword,
  resetPassword,
  updateProfile,
  updateUser,
  refreshAccessToken,
};
