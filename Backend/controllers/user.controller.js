const activityService = require("../services/activity.service");
const userService = require("../services/user.service");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");
const User = require("../models/users");

exports.getUsers = catchAsync(async (req, res) => {
  const users = await userService.getUsers();
  return res.json(users);
});

exports.getActivityLogs = catchAsync(async (req, res) => {
  const logs = await userService.getActivityLogs();
  return res.json(logs);
});

exports.getUserById = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.id);
  return res.json(user);
});

exports.deleteUser = catchAsync(async (req, res) => {
  await userService.deleteUser(req.params.id, req.user);
  return res.json({ message: "User Deleted" });
});

exports.forgotPassword = catchAsync(async (req, res) => {
  await userService.forgotPassword(req.body.email);
  return res.json({
    message: "If that email exists, a reset link has been sent.",
  });
});

exports.resetPassword = catchAsync(async (req, res) => {
  await userService.resetPassword(req.params.token, req.body.password);
  return res.json({ message: "Password updated successfully!" });
});

exports.updateProfile = catchAsync(async (req, res) => {
  const updatedUser = await userService.updateProfile(
    req.user?.id,
    req.body.name,
  );

  return res.status(200).json({
    message: "Profile Updated Successfully",
    user: {
      id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      isTwoFactorEnabled: updatedUser.isTwoFactorEnabled,
    },
  });
});

exports.updateUser = catchAsync(async (req, res) => {
  const updatedUser = await userService.updateUser(req.params.id, req.body);
  return res.json(updatedUser);
});

exports.refreshToken = catchAsync(async (req, res) => {
  const accessToken = await userService.refreshAccessToken(
    req.body.refreshToken,
  );
  return res.json({ accessToken });
});

exports.unlockUser = catchAsync(async (req, res) => {
  const User = require("../models/users");

  const user = await User.findById(req.params.id);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  user.failedLoginAttempts = 0;
  user.lockUntil = null;
  await user.save();

  await activityService.logActivity({
    userId: req.user.id,
    userEmail: req.user.email,
    action: "ACCOUNT_UNLOCKED",
    details: `Admin unlocked account: ${user.email}`,
  });

  res.json({ success: true, message: "Account unlocked successfully" });
});

exports.updateUserRole = catchAsync(async (req, res) => {
  const { role } = req.body;

  if (!role || !["user", "admin"].includes(role)) {
    throw new AppError("Invalid role. Must be 'user' or 'admin'", 400);
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.params.id,
    { role },
    { new: true },
  ).select("-password");

  if (!updatedUser) {
    throw new AppError("User not found", 404);
  }

  await activityService.logActivity({
    userId: req.user.id,
    userEmail: req.user.email,
    action: "ROLE_UPDATED",
    details: `Changed role of ${updatedUser.email} to ${role}`,
  });

  res.json({
    success: true,
    message: "Role updated successfully",
    user: updatedUser,
  });
});

exports.getLoginHistory = catchAsync(async (req, res) => {
  const User = require("../models/users");

  const user = await User.findById(req.user.id).select("loginHistory");

  if (!user) {
    throw new AppError("User not found", 404);
  }

  res.json({ loginHistory: user.loginHistory || [] });
});
