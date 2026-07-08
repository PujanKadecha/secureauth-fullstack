const nodemailer = require("nodemailer");
const ejs = require("ejs");
const path = require("path");
require("dotenv").config();

const emailPort = Number(process.env.EMAIL_PORT) || 587;

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: emailPort,
  secure: emailPort === 465,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
  connectionTimeout: 10000,
});

const sendMail = async ({ from, to, subject, html }) => {
  return transporter.sendMail({ from, to, subject, html });
};

const renderEmailTemplate = async (templateName, data) => {
  const templatePath = path.join(__dirname, "../views/emails", templateName);
  return ejs.renderFile(templatePath, data);
};

const sendVerificationEmail = async (user, token) => {
  const verificationLink = `${process.env.CLIENT_URL || "https://secureauth-fullstack.vercel.app"}?verifyToken=${token}`;

  const html = await renderEmailTemplate("verification.html", {
    name: user.name,
    verificationLink,
  });

  return sendMail({
    from: '"SecureAuth" <no-reply@secureauth.com>',
    to: user.email,
    subject: "Verify Your Email Address",
    html,
  });
};

const sendPasswordResetEmail = async (user, token) => {
  const resetLink = `${process.env.CLIENT_URL || "https://secureauth-fullstack.vercel.app"}?resetToken=${token}`;

  const html = await renderEmailTemplate("password-reset.html", {
    name: user.name,
    resetLink,
  });

  return sendMail({
    from: '"SecureAuth Security" <security@secureauth.com>',
    to: user.email,
    subject: "Reset Your Password",
    html,
  });
};

module.exports = {
  transporter,
  sendMail,
  sendVerificationEmail,
  sendPasswordResetEmail,
};
