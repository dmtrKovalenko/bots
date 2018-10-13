const env = process.env.NODE_ENV || "development";

export { env };
export default {
  ports: {
    telegram: process.env.TELEGRAM_PORT ? Number(process.env.TELEGRAM_PORT) : 8443,
    viber: process.env.VIBER_PORT ? Number(process.env.VIBER_PORT) : 8080,
  },
};
