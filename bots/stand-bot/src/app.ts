// tslint:disable no-var-requires
require("dotenv").config();

import { ActionExecutor, TelegramBot, ViberBot } from "bot-core";
import actions from "./actions";
import config, { env } from "./constants/config";
import cache from "./services/cache";
import Logger from "./services/Logger";

const executor = new ActionExecutor(actions, Logger, cache);

export const telegramBot = new TelegramBot(
  process.env.TELEGRAM_BOT_TOKEN,
  "standBot",
  Logger,
  executor,
  env !== "production",
  env === "production",
  config.ports.telegram,
);

if (env === "production" && process.env.START_TELEGRAM === "true") {
  telegramBot.listen();
}

export const viberBot = new ViberBot(
  process.env.VIBER_BOT_TOKEN,
  "standBot",
  Logger,
  executor,
  config.ports.viber,
);

if (process.env.START_VIBER === "true") {
  viberBot.listen();
}

if (process.env.START_CRON === "true") {
  require("./cron");
}
