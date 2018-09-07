import bluebird from "bluebird";
import cacheManager from "cache-manager";
import redisStore from "cache-manager-redis-store";
import config from "../constants/config";

const redisCache = cacheManager.caching({
  auth_pass: config.redis.password,
  db: 0,
  host: config.redis.host,
  port: config.redis.port,
  store: redisStore,
  ttl: 24000, // 1 day
} as any);

bluebird.promisifyAll(redisCache);

export default redisCache;
