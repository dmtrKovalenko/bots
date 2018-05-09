import bluebird from "bluebird";
import cacheManager from "cache-manager";
import redisStore from "cache-manager-redis-store";
import config from "../constants/config";

const redisCache = cacheManager.caching({
  db: 1, // 0 is for action sessions
  host: config.redis.host,
  port: config.redis.port,
  store: redisStore,
  ttl: 24000, // 1 day
} as any);

bluebird.promisifyAll(redisCache);

export default redisCache;
