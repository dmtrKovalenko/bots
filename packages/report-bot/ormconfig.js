require('dotenv').config()
const path = require('path')

module.exports = {
  type: 'postgres',
  entities: [path.resolve(__dirname, 'db', "models")],
  url: process.env.DATABASE_URL,
  migrations: ["migrations/*.ts"],
  cli: {
    migrationsDir: "migrations"
  }
}
