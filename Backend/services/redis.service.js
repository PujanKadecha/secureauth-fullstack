const redisClient = require("../config/redis");

class RedisService {
  async set(key, value) {
    await redisClient.set(key, JSON.stringify(value));
  }

  async get(key) {
    const data = await redisClient.get(key);

    if (!data) {
      return null;
    }

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

  async storeRefreshTokens(userId, refreshTokens) {
    await this.setWithTTL(`refresh:${userId}`, refreshTokens, 60 * 60 * 24 * 7);
  }

  async getRefreshTokens(userId) {
    return await this.get(`refresh:${userId}`);
  }

  async deleteRefreshToken(token) {
    await this.delete(`refresh:${token}`);
  }

  async storeResetToken(userId, token) {
    await this.setWithTTL(`reset:${userId}`, token, 60 * 10);
  }

  async getResetToken(userId) {
    return await this.get(`reset:${userId}`);
  }

  async removeResetToken(userId) {
    await this.delete(`reset:${userId}`);
  }

  async storeVerificationToken(userId, token) {
    await this.setWithTTL(`verify:${userId}`, token, 60 * 15);
  }

  async getVerificationToken(userId) {
    return await this.get(`verify:${userId}`);
  }

  async removeVerificationToken(userId) {
    await this.delete(`verify:${userId}`);
  }

  async cacheUser(user) {
    await this.setWithTTL(`user:${user._id}`, user, 60 * 5);
  }

  async getCachedUser(userId) {
    return await this.get(`user:${userId}`);
  }

  async removeCachedUser(userId) {
    await this.delete(`user:${userId}`);
  }
}

module.exports = new RedisService();
