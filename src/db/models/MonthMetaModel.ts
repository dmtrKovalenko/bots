
import { AllowNull, Column, CreatedAt, DataType, Model, PrimaryKey, Table, UpdatedAt } from "sequelize-typescript";

@Table({ tableName: "monthly_meta" })
export default class MonthMeta extends Model<MonthMeta> {
  @CreatedAt
  public created_at: Date;

  @UpdatedAt
  public updated_at: Date;

  @PrimaryKey
  @AllowNull(false)
  public month: Date;

  @Column(DataType.STRING(254))
  public report_url: string;

  @Column(DataType.STRING(254))
  public scheme_url: string;

  public toModel(): MonthMeta {
    return this.get({ plain: true});
  }
}
