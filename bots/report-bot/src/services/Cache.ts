import bluebird from "bluebird";
import cacheManager from "cache-manager";

const cache = cacheManager.caching({
  store: "memory",
  ttl: 24000, // 1 day
});

export default bluebird.promisifyAll(cache);
