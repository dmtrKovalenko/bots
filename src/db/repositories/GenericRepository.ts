import Bluebird from "bluebird";
import { UpdateOptions } from "sequelize";
import UserModel from "../models/UserModel";

export default abstract class GenericRepository<T> {
  protected abstract relation: typeof UserModel;

  public findAll(options?: object): Bluebird<T[]> {
    return this.relation.findAll(options)
      .then((res) => res.map((userModel) => userModel.get({ plain: true })));
  }

  public async create(user: T): Promise<T> {
    return this.relation.create(user)
      .then((model) => model.get({ plain: true }));
  }

  public updateWhere(user: T, options: UpdateOptions) {
    return this.relation.update(user, options);
  }

  public find(options: object): Bluebird<T | null> {
    return this.relation.findOne(options)
      .then((model) => model ? model.get({ plain: true }) : null);
  }
}
