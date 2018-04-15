
import sequelize from 'sequelize'
import UserModel from '../models/User'
import User from '../../models/User';

const { Op } = sequelize

export default class UserRepository {
  static getById(id: string) {
    return UserModel.findOne({
      where: {
        id: { [Op.eq]: id  }
      }
    })
      .then(user => user ? user.get({ plain: true}) : null)
  }

  static create(user: User) {
    return UserModel.create(user);
  }
}

