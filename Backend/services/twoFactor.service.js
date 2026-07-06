const qrcode = require("qrcode");
const otplibRaw = require("otplib");


const otplibModule = otplibRaw.default || otplibRaw;
let authenticator;

if (otplibModule.authenticator) {
  authenticator = otplibModule.authenticator;
} else {
  authenticator = {
    generateSecret: otplibModule.generateSecret,
    keyuri: (accountName, issuer, secret) => {
      if (typeof otplibModule.generateURI === "function") {
        return otplibModule.generateURI({ issuer, label: accountName, secret });
      }
      return "";
    },
    verify: (options) => {
      if (typeof otplibModule.verifySync === "function") {
        const result = otplibModule.verifySync({
          secret: options.secret,
          token: options.token,
        });
        return result && typeof result === "object" ? result.valid : !!result;
      }
      return false;
    },
  };
}

const ISSUER = "SecureAuthApi";

const generateSecret = () => authenticator.generateSecret();

const generateQrCode = async (email, secret) => {
  const otpauth = authenticator.keyuri(email, ISSUER, secret);
  return qrcode.toDataURL(otpauth);
};

const verifyToken = (token, secret) => authenticator.verify({ token, secret });

module.exports = {
  generateSecret,
  generateQrCode,
  verifyToken,
};
