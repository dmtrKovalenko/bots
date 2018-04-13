require('dotenv').load()

const dbConfig = {
  url: process.env.DATABASE_URL,
  define: {
    underscored: true,
    underscoredAll: true
  },
  dialectOptions: {
    ssl: true
  },
  dialect: 'postgres',
}

module.exports = {
  // config are same
  development: dbConfig,
  production: dbConfig
}
