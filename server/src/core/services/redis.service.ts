import { Redis } from "ioredis";
import { env } from "../config/env";

class RedisService {
  private redis: Redis;

  constructor() {
    this.redis = new Redis(env.REDIS_URL);
  }

  get client() {
    return this.redis;
  }
}

export default RedisService;
