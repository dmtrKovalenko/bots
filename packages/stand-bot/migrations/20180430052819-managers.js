module.exports = {
  up: ({ sequelize: db }) => db.transaction(async (transaction) => {
    await db.query(`ALTER TABLE users ADD COLUMN is_manager boolean NOT NULL DEFAULT false;`, { transaction })
  }),
  down: ({ sequelize: db }) => db.transaction(async (transaction) => {
    await db.query('ALTER TABLE users DROP COLUMN is_manager', { transaction })
  })
}
