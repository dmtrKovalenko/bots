import Bluebird from "bluebird";
import { UpdateOptions } from "sequelize";
import UserModel from "../models/UserModel";

type BaseModel = typeof UserModel;

export default abstract class GenericRepository<T> {
  protected abstract relation: BaseModel;

  public findAll(options?: object): Bluebird<T[]> {
    return this.relation.findAll(options)
      .then((res) => res.map((model) => model.get({ plain: true })));
  }

  public async create(entity: T): Promise<T> {
    return this.relation.create(entity)
      .then((model) => model.get({ plain: true }));
  }

  public updateWhere(entity: T, options: UpdateOptions) {
    return this.relation.update(entity, options);
  }

  public find(options: object): Bluebird<T | null> {
    return this.relation.findOne(options)
      .then((model) => model ? model.get({ plain: true }) : null);
  }
}
