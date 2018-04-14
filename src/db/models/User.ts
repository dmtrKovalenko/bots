import { Table, Column, Model, CreatedAt, UpdatedAt, PrimaryKey, AllowNull } from 'sequelize-typescript';

@Table({ tableName: 'users' })
export default class User extends Model<User> {
  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @PrimaryKey
  @AllowNull(false)
  @Column
  id: string;

  @AllowNull(false)
  @Column
  teamup_key: string;

  constructor(
    id: string,
    teamup_key: string
  ) {
    super()
    this.id = id;
    this.teamup_key = teamup_key;

    this.created_at = new Date();
    this.updated_at = new Date()
  }
}
