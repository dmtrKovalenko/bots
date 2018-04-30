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
  serviceUserProfile: new UserProfile("Service", undefined, undefined, "ksmu2qfoi4ixezwys3"),
};
