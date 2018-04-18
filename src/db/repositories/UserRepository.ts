import sequelize from "sequelize";
import User from "../../models/User";
import UserProfile from "../../models/UserProfile";
import UserModel from "../models/UserModel";

const { Op } = sequelize;

export default class UserRepository {
  public static findByProfile(profile: UserProfile) {
    return this.find({ where: this.profileWhere(profile.viber_id, profile.telegram_id) });
  }

  public static findByKey(teamup_key: string) {
    return this.find({ where: { teamup_key } });
  }

  public static findByKeyOrProfile(teamup_key: string, profile: UserProfile) {
    return this.find({ where: {
      [Op.or]: [
        this.profileWhere(profile.viber_id, profile.telegram_id),
        { teamup_key },
      ],
    }});
  }

  public static async create(user: User) {
    return UserModel.create(user)
      .then((userModel) => userModel.toUser());
  }

  public static update(user: User) {
    return UserModel.update(user, {
      where: { teamup_key: user.teamup_key },
    });
  }

  private static find(options: object) {
    return UserModel.findOne(options)
      .then((model) => model ? model.toUser() : null);
  }

  private static profileWhere = (viber_id?: string, telegram_id?: number) => ({
    [Op.or]: [{ viber_id }, { telegram_id }],
  })
}
