import { env } from "constants/config";
import { TelegramStandBot } from "models/Bots";
import Message from "models/Message";
import { ProcessMessageContext } from "models/ProcessMessageContext";
import UserProfile from "models/UserProfile";
import TelegramBot, { ConstructorOptions, WebHookOptions } from "node-telegram-bot-api";
import publicUrl from "services/PublicUrl";
import StandBot from "./StandBot";

const token = process.env.TELEGRAM_BOT_TOKEN;

if (!token) {
  throw new Error("TELEGRAM_BOT_TOKEN token should be provided");
}

const options: ConstructorOptions = {
  polling: env === "development" && process.env.START_TELEGRAM === "true",
  webHook: env === "production"
    ? { port: process.env.TELEGRAM_PORT || 8443 } as WebHookOptions
    : false,
};

const bot = new TelegramBot(token, options);
export const telegramBot = new TelegramStandBot("StandBot", bot);

bot.on("message", ({ chat, from, text }) => {
  const userProfile = new UserProfile(`${from.first_name} ${from.last_name}`, from.id, undefined);
  const context = new ProcessMessageContext(
    telegramBot,
    userProfile,
    new Message(text),
    (message: string) => telegramBot.sendMessageToChat(message, chat.id),
  );

  StandBot
    .processMessage(context)
    .catch(context.handleError);
});

if (env === "production" && process.env.START_TELEGRAM === "true") {
  // Start the bot 🚀
  publicUrl().then((url) => {
      console.log("Set telegram webhook to", url);
      bot.setWebHook(`${url}/bot${token}`);
    });
}
