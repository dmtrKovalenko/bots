import sequelize from "sequelize";

import User from "../../models/User";
import UserProfile from "../../models/UserProfile";
import UserModel from "../models/UserModel";
import GenericRepository from "./GenericRepository";

const { Op } = sequelize;

class UserRepository extends GenericRepository<User> {
  protected relation = UserModel as any;

  public getAllManagers() {
    return this.findAll({ where: { is_manager: true }});
  }

  public findByProfile(profile: UserProfile) {
    return this.find({ where: this.profileWhere(profile.viber_id, profile.telegram_id) });
  }

  public findByKey(teamup_key: string) {
    return this.find({ where: { teamup_key } });
  }

  public findByTeamupName(teamup_user_name: string) {
    return this.find({ where: { teamup_user_name }});
  }

  public findByKeyOrProfile(teamup_key: string, profile: UserProfile) {
    return this.find({ where: {
      [Op.or]: [
        this.profileWhere(profile.viber_id, profile.telegram_id),
        { teamup_key },
      ],
    }});
  }

  public update(user: User) {
    return this.updateWhere(user, {
      where: { teamup_key: user.teamup_key },
    });
  }

  private profileWhere = (viber_id?: string, telegram_id?: number) => ({
    [Op.or]: [{ viber_id }, { telegram_id }],
  })
}

export default new UserRepository();
