// tslint:disable no-var-requires
require("dotenv").config();
require("./db");

// make sure that env variables can only be strings
if (process.env.START_TELEGRAM === "true") {
  require("./bots/telegram");
}

if (process.env.START_VIBER === "true") {
  require("./bots/viber");
}

if (process.env.START_CRON === "true") {
  require("./cronjobs");
}
