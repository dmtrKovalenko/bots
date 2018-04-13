require('dotenv').load()

const dbConfig = {
  url: process.env.DATABASE_URL,
  define: {
    underscored: true,
    underscoredAll: true
  },
  dialectOptions: {
    ssl: process.env.DATABASE_SSL_SUPPORT === 'true'
  },
  dialect: 'postgres'
}

module.exports = {
  // config are same
  development: dbConfig,
  production: dbConfig
}
