// tslint:disable no-var-requires
require("dotenv").config();
require("./db");

// make sure that env variables can only be strings
if (process.env.START_TELEGRAM === "true") {
  require("./app/bots/telegram");
}

if (process.env.START_VIBER === "true") {
  require("./app/bots/viber");
}

if (process.env.START_CRON === "true") {
  require("./app/cron");
}
