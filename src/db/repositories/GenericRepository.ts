import { UpdateOptions, WhereOptions } from "sequelize";
import { Model } from "sequelize-typescript/lib/models/Model";

// create an empty class extended of model because typescript will think
// that every model is equal to empty model with the same inheritance
class BaseModel extends Model<BaseModel> { }

export default abstract class GenericRepository<T> {
  public constructor(protected relation: typeof BaseModel) { }

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

  public async upsert(value: T, condition: WhereOptions<T>) {
    const existed = await this.relation.findOne({ where: condition });

    if (existed) {
      return existed.update(value);
    } else {
      return this.relation.create(value);
    }
  }
}
