module.exports = {
  up: ({ sequelize: db }) => db.transaction(async (transaction) => {
    await db.query(`CREATE TABLE IF NOT EXISTS public.users (
      id character varying(64) NOT NULL CONSTRAINT users_pk PRIMARY KEY,
      teamup_key character varying(64) NOT NULL,
      created_at timestamp with time zone NOT NULL,
      updated_at timestamp with time zone NOT NULL
    )`, { transaction })
    await db.query('CREATE UNIQUE INDEX IF NOT EXISTS users_token ON public.users USING btree (teamup_key)', { transaction })
  }),
  down: ({ sequelize: db }) => db.transaction(async (transaction) => {
    await db.query('DROP table users;', { transaction })
  })
}
