import UserRepository from "../db/repositories/UserRepository";
import User from "../models/User";
import UserProfile from "../models/UserProfile";

export default class AuthManager {
  public static async getCalendarKey(userProfile: UserProfile) {
    const user = await UserRepository.findByProfile(userProfile);
    return user ? user.teamup_key : null;
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
