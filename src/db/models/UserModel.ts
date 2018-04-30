
import { AllowNull, Column, CreatedAt, DataType, Model, PrimaryKey, Table, UpdatedAt } from "sequelize-typescript";
import User from "../../models/User";

@Table({ tableName: "users" })
export default class UserModel extends Model<UserModel> {
  @CreatedAt
  public created_at: Date;

  @UpdatedAt
  public updated_at: Date;

  @PrimaryKey
  @AllowNull(false)
  @Column(DataType.STRING(64))
  public teamup_key: string;

  @Column(DataType.STRING(64))
  public viber_id: string;

  @Column
  public telegram_id: number;

  @Column
  public is_manager: boolean;

  public toUser(): User {
    return this.get({ plain: true});
  }
}
