import sequelizeConfig from "./sequelize.js";
export const env = process.env.NODE_ENV || "development";

const dbConfig = sequelizeConfig[env];

export default {
  availableDateFormats: ["dd MM", "dd.mm"],
  db: {
    options: {
      define: dbConfig.define,
      dialect: dbConfig.dialect,
      dialectOptions: dbConfig.dialectOptions,
    },
    url: dbConfig.url,
  },
};
