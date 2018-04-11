import DBManager from '../managers/DBManager';

const db = new DBManager('users')

export default class AuthManager {
  static getCalendarKey(userId: string) {
    try {
      return db.get(userId)
    } catch(e) {
      return null
    }
  }

  static addCalendarKey(userId: string, key: string) {
    db.push(userId, key)
    return
  }
}
