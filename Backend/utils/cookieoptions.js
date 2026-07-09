const refreshCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  path: "/api",
  maxAge: 7 * 24 * 60 * 60 * 1000, 
};

module.exports = { refreshCookieOptions };