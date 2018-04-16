import UserRepository from "../db/repositories/UserRepository";
import User from "../models/User";

export default class AuthManager {
  static async getCalendarKey(userId: string) {
    const user = await UserRepository.findById(userId);
    return user ? user.teamup_key : null;
  }

  static async addCalendarKey(userId: string, key: string): Promise<void> {
    const user = await UserRepository.findById(userId);
    if (user == null) {
      await UserRepository.create(User.create(userId, key));
    } else {
      user.teamup_key = key;
      await UserRepository.update(user);
    }
  }
}
