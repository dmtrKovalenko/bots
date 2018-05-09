import UserProfile from "../models/UserProfile";
import sequelizeConfig from "./sequelize.js";
export const env = process.env.NODE_ENV || "development";

const dbConfig = sequelizeConfig[env];

export default {
  availableDateFormats: ["dd MM", "dd.mm"],
  availableTimeFormats: ["HH:mm", "H:mm", "H"],
  db: {
    options: {
      define: dbConfig.define,
      dialect: dbConfig.dialect,
      dialectOptions: dbConfig.dialectOptions,
    },
    url: dbConfig.url,
  },
  redis: {
    host: process.env.REDIS_HOST || "localhost",
    password: process.env.REDIS_PASSWORD,
    port: Number(process.env.REDIS_PORT) || 6379,
  },
  serviceUserProfile: new UserProfile("Service", undefined, undefined, "ksmu2qfoi4ixezwys3"),
};
