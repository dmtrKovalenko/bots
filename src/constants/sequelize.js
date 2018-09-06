require('dotenv').load();

console.log(process.env)
const dbConfig = {
  aliases: false,
  url: process.env.DATABASE_URL,
  define: {
    underscored: true,
    underscoredAll: true
  },
  dialectOptions: {
    ssl: !process.env.DISABLE_SSL
  },
  dialect: 'postgres'
};

module.exports = {
  // config are same
  development: dbConfig,
  production: dbConfig
};
