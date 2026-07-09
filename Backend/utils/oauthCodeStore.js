const crypto = require("crypto");

const codes = new Map();
const CODE_TTL_MS = 60 * 1000;

const createOAuthCode = (payload) => {
  const code = crypto.randomBytes(32).toString("hex");

  codes.set(code, { payload, expiresAt: Date.now() + CODE_TTL_MS });

  setTimeout(() => codes.delete(code), CODE_TTL_MS).unref();

  return code;
};

const consumeOAuthCode = (code) => {
  const entry = codes.get(code);
  if (!entry) return null;

  codes.delete(code);

  if (Date.now() > entry.expiresAt) return null;

  return entry.payload;
};

module.exports = { createOAuthCode, consumeOAuthCode };
