import { UserProfile } from "bot-core";
import sequelizeConfig from "./sequelize.js";

const env = process.env.NODE_ENV || "development";
const dbConfig = sequelizeConfig[env];

export { env };
export default {
  availableDateFormats: ["dd MM", "dd.MM"],
  availableTimeFormats: ["HH:mm", "H:mm", "H"],
  db: {
    options: {
      define: dbConfig.define,
      dialect: dbConfig.dialect,
      dialectOptions: dbConfig.dialectOptions,
    },
    url: dbConfig.url,
  },
  ports: {
    telegram: process.env.TELEGRAM_PORT ? Number(process.env.TELEGRAM_PORT) : 8443,
    viber: process.env.VIBER_PORT ? Number(process.env.VIBER_PORT) : 8080,
  },
  redis: {
    host: process.env.REDIS_HOST || "localhost",
    password: process.env.REDIS_PASSWORD,
    port: Number(process.env.REDIS_PORT) || 6379,
  },
  serviceUserProfile: new UserProfile("Service", undefined, undefined, "ksmu2qfoi4ixezwys3"),
  teamUpApiUrl: "https://api.teamup.com",
  weekDaysWorking: [5, 6],
};
