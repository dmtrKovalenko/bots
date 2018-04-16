module.exports = {
  up: ({ sequelize: db }) => db.transaction(async (transaction) => {
    await db.query(`
      ALTER TABLE users RENAME id to viber_id;
      ADD COLUMN telegram_id int NULL;
      ALTER COLUMN viber_id DROP NOT NULL;
    `, { transaction })

    await db.query('ALTER TABLE users DROP CONSTRAINT IF EXISTS users_pk, ADD CONSTRAINT users_pk PRIMARY KEY (teamup_key),', { transaction })
    await db.query('DROP INDEX users_token')
    await db.query('CREATE UNIQUE INDEX IF NOT EXISTS users_viber_id ON public.users USING btree (viber_id)', { transaction })
    await db.query('CREATE UNIQUE INDEX IF NOT EXISTS users_telegram_id ON public.users USING btree (telegram_id)', { transaction })
  }),
  down: ({ sequelize: db }) => db.transaction(async (transaction) => {
    await db.query('ALTER TABLE users RENAME viber_id to id; DROP COLUMN telegram_id int;', { transaction })
    await db.query('ALTER TABLE users DROP CONSTRAINT IF EXISTS users_pk, ADD CONSTRAINT users_pk PRIMARY KEY (id),', { transaction })
    await db.query('DROP INDEX users_viber_id, users_telegram_id')
    await db.query('CREATE UNIQUE INDEX IF NOT EXISTS users_token ON public.users USING btree (teamup_key)', { transaction })
  })
}
