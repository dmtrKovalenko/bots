import { Sequelize, DataTypes } from "sequelize";

export default (sequelize: Sequelize, DataTypes: DataTypes) => {
  const UserModel = sequelize.define('User', {
    id: {
      type: DataTypes.STRING(64),
      allowNull: false,
      primaryKey: true,
    },
    teamup_key: {
      type: DataTypes.STRING(64),
      allowNull: false,
    },
  }, {
    indexes: [
      { unique: true, fields: ['teamup_key'] }
    ],
  })

  return UserModel
}
