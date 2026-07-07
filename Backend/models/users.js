const mongoose = require("mongoose");

const userSChema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  refreshToken: [
    {
      type: String,
    },
  ],

  isVerified: {
    type: Boolean,
    default: false,
  },
  verificationToken: {
    type: String,
  },
  role: {
    type: String,
    default: "user",
  },
  resetPasswordToken: {
    type: String,
  },
  resetPasswordExpire: {
    type: Date,
  },
  twoFactorSecret: {
    type: String,
    default: "",
  },
  isTwoFactorEnabled: {
    type: Boolean,
    default: false,
  },
  failedLoginAttempts : {
    type : Number,
    default : 0
  },
  lockUntil : {
    type : Date,
    default : null
  }
});

module.exports = mongoose.model("User", userSChema);
