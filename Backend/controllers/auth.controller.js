const authService = require("../services/auth.service");
const catchAsync = require("../utils/catchAsync");
const { refreshCookieOptions } = require("../utils/cookieoptions");

exports.register = catchAsync(async (req, res) => {
  await authService.register(req.body);

  res.status(201).json({
    message: "Registration done! Please check your email for verification.",
  });
});

exports.login = catchAsync(async (req, res) => {
  const result = await authService.login(req.body);

  if (result.isTwoFactorRequired) {
    return res.status(200).json({
      isTwoFactorRequired: true,
      userId: result.userId,
      message: "Two Factor Authentication is Required",
    });
  }

  res.cookie("refreshToken", result.refreshToken, refreshCookieOptions);

  return res.status(200).json({
    accessToken: result.accessToken,
    user: result.user,
  });
});

exports.logout = catchAsync(async (req, res) => {
  const token = req.cookies?.refreshToken;
  await authService.logout(token);
  res.clearCookie("refreshToken", { path: "/api" });
  return res.json({ message: "Logout Successfully" });
});

exports.verifyEmail = catchAsync(async (req, res) => {
  await authService.verifyEmail(req.query.token);
  return res.send("Email verified successfully");
});

exports.googleCallback = catchAsync(async (req, res) => {
  const { accessToken, refreshToken, user } = await authService.googleLogin(
    req.user,
  );

  res.cookie("refreshToken", refreshToken, refreshCookieOptions);

  const userData = encodeURIComponent(
    JSON.stringify({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    }),
  );

  return res.redirect(
    `https://secureauth-fullstack.vercel.app?token=${accessToken}&user=${userData}`,
  );
});

exports.verifyTwoFactorLogin = catchAsync(async (req, res) => {
  const result = await authService.verifyTwoFactorLogin(req.body);

  res.cookie("refreshToken", result.refreshToken, refreshCookieOptions);

  return res.status(200).json({
    accessToken: result.accessToken,
    user: result.user,
  });
});

exports.setupTwoFactor = catchAsync(async (req, res) => {
  const result = await authService.setupTwoFactor(req.user.id);
  return res.json(result);
});

exports.enableTwoFactor = catchAsync(async (req, res) => {
  await authService.enableTwoFactor(req.user.id, req.body.token);
  return res.json({
    message: "Two-Factor Authentication is now enabled.",
  });
});

exports.disableTwoFactor = catchAsync(async (req, res) => {
  await authService.disableTwoFactor(req.user.id);
  return res.json({ message: "2FA successfully disabled" });
});