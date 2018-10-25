require("dotenv").config(); // tslint:disable-line

import { ActionExecutor, TelegramBot } from "bot-core";
import config, { env } from "./constants/config";
import Cache from "./services/Cache";
import Logger from "./services/Logger";

const executor = new ActionExecutor([], Logger, Cache);

export const telegramBot = new TelegramBot(
  process.env.TELEGRAM_BOT_TOKEN,
  "standBot",
  Logger,
  executor,
  env !== "production",
  env === "production",
  config.ports.telegram,
);

if (env === "production") {
  telegramBot.listen();
}
