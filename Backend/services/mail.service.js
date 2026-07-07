const nodemailer = require("nodemailer");
const ejs = require("ejs");
const path = require("path");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.gmail.com",
  port: Number(process.env.EMAIL_PORT || 465),
  secure: true,
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendMail = async ({ from, to, subject, html }) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    throw new Error("Email credentials are not configured");
  }

  return transporter.sendMail({ from, to, subject, html });
};


const renderEmailTemplate = async (templateName, data) => {
  const templatePath = path.join(__dirname, "../views/emails", templateName);
  return ejs.renderFile(templatePath, data);
};

const sendVerificationEmail = async (user, token) => {
  const verificationLink = `${process.env.CLIENT_URL || 'http://localhost:3000'}?verifyToken=${token}`;

  const html = await renderEmailTemplate("verification.html", {
    name: user.name,
    verificationLink
  });

  return sendMail({
    from: '"SecureAuth" <no-reply@secureauth.com>',
    to: user.email,
    subject: "Verify Your Email Address",
    html
  });
};

const sendPasswordResetEmail = async (user, token) => {
  const resetLink = `${process.env.CLIENT_URL || 'http://localhost:3000'}?resetToken=${token}`;

  const html = await renderEmailTemplate("password-reset.html", {
    name: user.name,
    resetLink
  });

  return sendMail({
    from: '"SecureAuth Security" <security@secureauth.com>',
    to: user.email,
    subject: "Reset Your Password",
    html
  });
};

module.exports = {
  transporter,
  sendMail,
  sendVerificationEmail,
  sendPasswordResetEmail,
};