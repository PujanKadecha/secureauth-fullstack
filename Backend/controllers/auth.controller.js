const authService = require("../services/auth.service");
const catchAsync = require("../utils/catchAsync");

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

  return res.status(200).json(result);
});

exports.logout = catchAsync(async (req, res) => {
  await authService.logout(req.body.token);
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

  const userData = encodeURIComponent(
    JSON.stringify({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    }),
  );

  return res.redirect(
    `http://localhost:3000?token=${accessToken}&refresh=${refreshToken}&user=${userData}`,
  );
});

exports.verifyTwoFactorLogin = catchAsync(async (req, res) => {
  const result = await authService.verifyTwoFactorLogin(req.body);
  return res.status(200).json(result);
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