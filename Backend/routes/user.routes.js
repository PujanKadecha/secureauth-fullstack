const express = require("express");
const router = express.Router();
const authenticationToken = require("../middleware/authentication");
const authorizeRole = require("../middleware/authorize");
const userController = require("../controllers/user.controller");
const { validateRoleChange } = require("../middleware/validator");

router.get(
  "/",
  authenticationToken,
  authorizeRole("admin"),
  userController.getUsers,
);
router.get(
  "/logs",
  authenticationToken,
  authorizeRole("admin"),
  userController.getActivityLogs,
);
router.post("/forgot-password", userController.forgotPassword);
router.post("/reset-password/:token", userController.resetPassword);
router.put("/profile", authenticationToken, userController.updateProfile);
router.post("/refresh", userController.refreshToken);
router.get(
  "/login-history",
  authenticationToken,
  userController.getLoginHistory,
);

router.get("/:id", authenticationToken, userController.getUserById);
router.delete(
  "/:id",
  authenticationToken,
  authorizeRole("admin"),
  userController.deleteUser,
);
router.put("/:id", authenticationToken, userController.updateUser);
router.post(
  "/:id/unlock",
  authenticationToken,
  authorizeRole("admin"),
  userController.unlockUser,
);
router.put(
  "/:id/role",
  authenticationToken,
  validateRoleChange,
  authorizeRole("admin"),
  userController.updateUserRole,
);


module.exports = router;
