require('dotenv').load()

const dbConfig = {
  url: process.env.DATABASE_URL,
  define: {
    underscored: true,
    underscoredAll: true
  },
  dialect: 'postgres',
}

module.exports = {
  config: dbConfig,
  // config are same
  development: dbConfig,
  production: dbConfig
}
