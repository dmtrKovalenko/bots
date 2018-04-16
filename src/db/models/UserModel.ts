import { Table, Column, Model, CreatedAt, UpdatedAt, PrimaryKey, DataType, AllowNull } from 'sequelize-typescript';
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
  teamup_key: string;

  @Column(DataType.STRING(64))
  viber_id: string;

  @Column
  telegram_id: number;

  public toUser(): User {
    return this.get({ plain: true});
  }
}
