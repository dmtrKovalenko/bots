
import sequelize from 'sequelize'
import UserModel from '../models/UserModel'
import User from '../../models/User';

const { Op } = sequelize;

export default class UserRepository {
  static async findById(id: string): Promise<User | null> {
    const userModel = await UserModel.findOne({
      where: this.where(id)
    });

    if (userModel == null)
      return null;

    return this.toUser(userModel);
  }

  static async create(user: User): Promise<User> {
    const userModel = await UserModel.create(user);

    return this.toUser(userModel);
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

  private static toUser(userModel: UserModel): User {
    return userModel ? userModel.get({ plain: true}) : null;
  }
}
