const { createClient } = require("redis");

const redisUrl = process.env.REDIS_URL;
const isProduction = process.env.NODE_ENV === "production";

if (!redisUrl && isProduction) {
  throw new Error(
    "REDIS_URL is required in production. Set REDIS_URL to your Redis endpoint.",
  );
}

if (!redisUrl && !isProduction) {
  console.warn(
    "REDIS_URL is not configured. Defaulting to localhost Redis on 127.0.0.1:6379.",
  );
}

const redisClient = createClient({
  url: redisUrl || "redis://127.0.0.1:6379",
});

redisClient.on("connect", () => {
  console.log("Redis Connected");
});

redisClient.on("error",(err)=> {
    console.log("Redis Error:",err);
});

module.exports = redisClient;