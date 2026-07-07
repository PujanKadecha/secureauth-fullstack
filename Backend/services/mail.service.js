const { Resend } = require("resend");
const ejs = require("ejs");
const path = require("path");
require("dotenv").config();

const resend = new Resend(process.env.RESEND_API_KEY);

const sendMail = async ({ from, to, subject, html }) => {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("Resend API key is not configured");
  }

  return resend.emails.send({
    from,
    to,
    subject,
    html,
  });
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
    from: process.env.EMAIL_FROM || "onboarding@resend.dev",
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
    from: process.env.EMAIL_FROM || "onboarding@resend.dev",
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