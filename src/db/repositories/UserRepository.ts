
import sequelize from 'sequelize'
import UserModel from '../models/UserModel'
import User from '../../models/User';
import UserProfile from '../../models/UserProfile';

const { Op } = sequelize;

export default class UserRepository {
  private static find(options: Object) {
    return UserModel.findOne(options)
      .then(model => model ? model.toUser() : null)
  }

  static findByProfile(profile: UserProfile) {
    return this.find({ where: this.profileWhere(profile.viber_id, profile.telegram_id) })
  }

  static findByKey(teamup_key: string) {
    return this.find({ where: { teamup_key } })
  }

  static findByKeyOrProfile(teamup_key: string, profile: UserProfile) {
    return this.find({ where: {
      [Op.or]: [
        this.profileWhere(profile.viber_id, profile.telegram_id),
        { teamup_key }
      ]
    }})
  }

  static async create(user: User) {
    return UserModel.create(user)
      .then(user => user.toUser())
  }

  public static update(user: User) {
    return UserModel.update(user, {
      where: { teamup_key: user.teamup_key }
    })
  }

  private static profileWhere = (viber_id?: string, telegram_id?: number) => ({
    [Op.or]: [{ viber_id }, { telegram_id }]
  })
}
