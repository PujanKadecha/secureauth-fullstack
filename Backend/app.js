const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const { generalLimiter } = require("./middleware/rateLimiter.js");
const passport = require("./config/passport.js");
const errorHandler = require("./middleware/errorHandler.js");
const securityMiddleware = require("./middleware/security.js");
const sanitizeInput = require("./middleware/sanitize.js");

const app = express();
app.set("trust proxy", 1);

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    exposedHeaders: ["Authorization"],
    maxAge: 86400,
  }),
);

app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());
app.use(securityMiddleware);
app.use(sanitizeInput);
app.use(express.json({ limit: "10kb" }));

app.use(generalLimiter);

app.use(passport.initialize());

app.use("/api/users", require("./routes/user.routes.js"));
app.use("/api/auth", require("./routes/auth.routes.js"));

app.use(errorHandler);

module.exports = app;