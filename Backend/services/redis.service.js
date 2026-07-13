const redisClient = require("../config/redis");

class RedisService {
  async set(key, value) {
    await redisClient.set(key, JSON.stringify(value));
  }

  async get(key) {
    const data = await redisClient.get(key);

    if (!data) return null;

    return JSON.parse(data);
  }

  async setWithTTL(key, value, ttl) {
    await redisClient.set(key, JSON.stringify(value), {
      EX: ttl,
    });
  }

  async delete(key) {
    await redisClient.del(key);
  }

  async exists(key) {
    return await redisClient.exists(key);
  }

  async ttl(key) {
    return await redisClient.ttl(key);
  }
}

module.exports = new RedisService();