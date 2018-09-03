module.exports = {
  up: ({ sequelize: db }) => db.transaction(async (transaction) => {
    await db.query(`ALTER TABLE users ADD COLUMN teamup_user_name varying(32) NOT NULL;`, { transaction })
  }),
  down: ({ sequelize: db }) => db.transaction(async (transaction) => {
    await db.query('ALTER TABLE users DROP COLUMN teamup_user_name', { transaction })
  })
}
