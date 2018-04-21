// tslint:disable no-var-requires
require("dotenv").config();
import "./db";

// make sure that env variables can only be strings
if (process.env.START_TELEGRAM === "true") {
  require("./bots/telegram");
}

if (process.env.START_VIBER === "false") {
  require("./bots/viber");
}
