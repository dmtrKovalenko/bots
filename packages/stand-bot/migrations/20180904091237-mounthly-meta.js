module.exports = {
  up: ({ sequelize: db }) => db.transaction(async (transaction) => {
    await db.query(`
      CREATE TABLE IF NOT EXISTS public.monthly_meta (
      month DATE NOT NULL CONSTRAINT monthly_meta_pk PRIMARY KEY,
      report_url character varying(254),
      scheme_url character varying(254),
      created_at timestamp with time zone NOT NULL,
      updated_at timestamp with time zone NOT NULL
    )`, { transaction })
  }),
  down: ({ sequelize: db }) => db.transaction(async (transaction) => {
    await db.query('DROP table monthly_meta;', { transaction })
  })
}
