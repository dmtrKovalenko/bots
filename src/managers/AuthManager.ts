import UserRepository from "../db/repositories/UserRepository";
import User from "../models/User";

export default class AuthManager {
  static getCalendarKey(userId: string) {
    return UserRepository.getById(userId)
      .then(console.log)
      .then((user: User) => user ? user.teamup_key : null)
  }

  static addCalendarKey(userId: string, key: string) {
    const user = new User(userId, key)
    return UserRepository.create(user)
  }
}
