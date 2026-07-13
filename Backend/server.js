const app = require("./app");
const connectDB = require("./config/db");
const redisClient = require("./config/redis");

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await connectDB();

    await redisClient.connect();

    app.listen(PORT, () => {
      console.log(
        `Server running on IPv4 at http://localhost:${PORT}`,
      );
    });
  } catch (err) {
    console.error("Server startup failed:", err);
    process.exit(1);
  }
}

startServer();