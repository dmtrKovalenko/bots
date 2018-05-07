import redis from "redis";
import { promisify } from "util";
import config from "../constants/config";

const redisClient = redis.createClient(config.redis);

// promisify values
const getAsync = promisify(redisClient.hgetall).bind(redisClient);
const hmSetAsync = promisify(redisClient.hmset).bind(redisClient);
const delAsync = promisify(redisClient.del).bind(redisClient);

export default class RedisService {
  public static set(key: string, value: { [key: string]: string | number }): Promise<{}> {
    return hmSetAsync(key, value);
  }

  public static get(key: string): Promise<{ [key: string]: string }> {
    return getAsync(key);
  }

  public static delete(key: string): Promise<{}> {
    return delAsync(key);
  }
}
