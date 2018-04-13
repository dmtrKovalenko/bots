const dotenv = require('dotenv')

dotenv.load()

module.exports = {
  development: {
    url: process.env.DATABASE_URL,
    define: {
      underscored: true,
      underscoredAll: true
    },
    dialect: 'postgres',
  }
}
