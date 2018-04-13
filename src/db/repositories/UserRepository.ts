import db, { sequelize } from '../index'
import UserModel from '../../models/User';

const { Op } = sequelize
const { User } = db

export default class UserRepository {
  static getById(id: string) {
    return User.findOne({
      where: {
        id: { [Op.eq]: id  }
      }
    })
      .then((user: any) => user ? user.get({ plain: true}) : null)
  }

  static create(user: UserModel) {
    return User.create(user);
  }
}

