import { Table, Column, Model, CreatedAt, UpdatedAt, PrimaryKey, AllowNull, DataType } from 'sequelize-typescript';
import User from "../../models/User";

@Table({ tableName: 'users' })
export default class UserModel extends Model<UserModel> {
  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @PrimaryKey
  @AllowNull(false)
  @Column(DataType.STRING(64))
  id: string;

  @AllowNull(false)
  @Column(DataType.STRING(64))
  teamup_key: string;

  public toUser(): User {
    return this.get({ plain: true});
  }
}
