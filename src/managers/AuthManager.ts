import UserRepository from "../db/repositories/UserRepository";
import User from "../models/User";
import UserProfile from "../models/UserProfile";
import cache from "../services/cache";

export default class AuthManager {
  public static async getCalendarKey(userProfile: UserProfile) {
    const cacheKey = `${userProfile.id}_auth`;
    const cached = await cache.get(cacheKey);

    if (!cached) {
      const user = await UserRepository.findByProfile(userProfile);
      const response = user ? user.teamup_key : null;

      await cache.set(cacheKey, response, { ttl: 86400 } );
      return response;
    }

    return cached;
  }

  public static findRegisteredFromOtherBot(key: string) {
    return UserRepository.findByKey(key);
  }

  public static async addCalendarKey(userProfile: UserProfile, key: string): Promise<void> {
    const user = await UserRepository.findByKeyOrProfile(key, userProfile);

    if (!user) {
      await UserRepository.create(new User(key, userProfile.telegram_id, userProfile.viber_id));
    } else {
      user.teamup_key = key;
      // update one of field that used now
      user.telegram_id = userProfile.telegram_id || user.telegram_id;
      user.viber_id = userProfile.viber_id || user.viber_id;

      await UserRepository.update(user);
    }
  }
}
