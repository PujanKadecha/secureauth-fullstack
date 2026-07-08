const axios = require("axios");
const ejs = require("ejs");
const path = require("path");
require("dotenv").config();
console.log("BREVO_API_KEY loaded:", !!process.env.BREVO_API_KEY);
const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

const sendMail = async ({ fromName, fromEmail, to, subject, html }) => {
  try {
    await axios.post(
      BREVO_API_URL,
      {
        sender: { name: fromName, email: fromEmail },
        to: [{ email: to }],
        subject,
        htmlContent: html,
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        timeout: 10000,
      }
    );
  } catch (err) {
    const apiError = err.response?.data?.message || err.message;
    throw new Error(`Brevo send failed: ${apiError}`);
  }
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
    fromName: "SecureAuth",
    fromEmail: process.env.EMAIL_USER,
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
    fromName: "SecureAuth Security",
    fromEmail: process.env.EMAIL_USER,
    to: user.email,
    subject: "Reset Your Password",
    html,
  });
};

module.exports = {
  sendMail,
  sendVerificationEmail,
  sendPasswordResetEmail,
};