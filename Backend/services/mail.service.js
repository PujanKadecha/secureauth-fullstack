const { Resend } = require("resend");
const ejs = require("ejs");
const path = require("path");
require("dotenv").config();

const resend = new Resend(process.env.RESEND_API_KEY);


const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

const sendMail = async ({ from, to, subject, html }) => {
  const { data, error } = await resend.emails.send({ from, to, subject, html });
  if (error) {
    throw new Error(error.message || "Failed to send email via Resend");
  }
  return data;
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
    from: `SecureAuth <${FROM_EMAIL}>`,
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
    from: `SecureAuth Security <${FROM_EMAIL}>`,
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