
import sequelize from 'sequelize'
import UserModel from '../models/UserModel'
import User from '../../models/User';

const { Op } = sequelize;

export default class UserRepository {
  static async findById(id: string): Promise<User | null> {
    const userModel = await UserModel.findOne({
      where: this.where(id)
    });

    return userModel ? userModel.toUser() : null;
  }

  static async create(user: User): Promise<User> {
    return (await UserModel.create(user)).toUser();
  }

  public static async update(user: User): Promise<void> {
    await UserModel.update(user, {
      where: this.where(user.id)
    })
  }

  private static where(id: string) {
    return {
      id: { [Op.eq]: id  }
    }
  }
}
