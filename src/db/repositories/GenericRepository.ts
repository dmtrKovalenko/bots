import { UpdateOptions } from "sequelize";
import { Model } from "sequelize";

type BaseModelType = typeof Model;
export default abstract class GenericRepository<T> {
  protected abstract relation: BaseModelType;

  public async findAll(options?: object): Promise<T[]> {
    return this.relation.findAll(options)
      .then((model) => model.map((item) => item.get({ plain: true })));
  }

  public async create(entity: T): Promise<T> {
    return this.relation.create(entity)
      .then((model) => model.get({ plain: true }));
  }

  public updateWhere(entity: T, options: UpdateOptions) {
    return this.relation.update(entity, options);
  }

  public async find(options: object): Promise<T | null> {
    return this.relation.findOne(options)
      .then((model) => model ? model.get({ plain: true }) : null);
  }
}
