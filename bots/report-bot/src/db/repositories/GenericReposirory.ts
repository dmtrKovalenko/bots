import { DeepPartial, FindOneOptions, getConnection, getManager, getRepository, ObjectType, Repository } from "typeorm";

export class GenericRepository<K, T extends K> {
  private baseRepo: Repository<T>;

  constructor(
    private objectClass: ObjectType<T>,
    getRepositoryFn = getRepository,
  ) {
    const connection = getConnection();

    if (connection.isConnected) {
      this.baseRepo = getRepositoryFn(objectClass);
      return;
    }

    connection.connect().then(() => {
      this.baseRepo = getRepositoryFn(objectClass);
    });
  }

  public findAll(): Promise<K[]> {
    return this.baseRepo.find();
  }

  public findOne(id?: any, options?: FindOneOptions<T>): Promise<K | null> {
    return this.baseRepo.findOne(id, options).then((res) => res || null);
  }

  public async create(entity: K): Promise<K> {
    const result = await this.baseRepo.insert(entity);
    const createdRow = await this.baseRepo.findByIds(result.identifiers);

    return createdRow[0] as K;
  }

  public async updateById(id: any, entity: DeepPartial<K>): Promise<K> {
    await this.baseRepo.update(id, entity as DeepPartial<T>);
    const updatedRow = await this.findOne(entity);

    return updatedRow as K;
  }

  public createTransaction(callback: (tRepo: GenericRepository<K, T>) => Promise<void>) {
    getManager().transaction((manager) => {
      const wrappedInTransition = new GenericRepository<K, T>(this.objectClass, (e) => manager.getRepository(e));
      return callback(wrappedInTransition);
    });
  }
}
