const app = require("./app");
const connectDB = require("./config/db");
const redisService = require("./services/redis.service");
const PORT = process.env.PORT || 5000;

const redisClient = require("./config/redis");

async function startServer() {
  try {
    await connectDB();

    await redisClient.connect();

    await redisService.set("user", {
      name: "Pujan",
      role: "Admin",
    });

    const user = await redisService.get("user");

    console.log(user);

    app.listen(PORT, () => {
      console.log(
        `Server running and listening on IPv4 at http://localhost:${PORT}`,
      );
    });
  } catch (err) {
    console.error("Server startup failed:", err);
    process.exit(1);
  }
}

startServer();
