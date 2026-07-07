const express = require("express");
const app = express();
const connectDB = require("./config/db");
const { generalLimiter } = require("./middleware/rateLimiter.js");
const cors = require("cors");
const passport = require("./config/passport.js");
const errorHandler = require("./middleware/errorHandler.js");
const swaggerUI = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");
const dotenv = require("dotenv");
const securityMiddleware = require ("./middleware/security.js");
const sanitizeInput = require("./middleware/sanitize.js");
dotenv.config();
const PORT = process.env.PORT;
const allowedOrigins = [
  process.env.CLIENT_URL,
  process.env.FRONTEND_URL,
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    exposedHeaders: ["Authorization"],
    maxAge: 86400,
  })
);

app.use(express.urlencoded({ extended: true }));
connectDB();
app.use(securityMiddleware);
app.use(sanitizeInput);
app.use(express.json());

app.use(generalLimiter);

app.use(passport.initialize());

app.use("/api/users", require("./routes/user.routes.js"));
app.use("/api/auth", require("./routes/auth.routes.js"));

app.use(
  "/api/docs",
  swaggerUI.serve,
  swaggerUI.setup(swaggerSpec)
);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(
    `Server running and listening on IPv4 at http://localhost:${PORT}`,
  );
});
