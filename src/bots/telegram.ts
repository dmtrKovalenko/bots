import TelegramBot, { ConstructorOptions, WebHookOptions } from "node-telegram-bot-api";
import { env } from "../constants/config";
import Message from "../models/Message";
import UserProfile from "../models/UserProfile";
import publicUrl from "../services/PublicUrl";
import { ProcessMessageContext } from "./events/ProcessMessage";
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

export const bot = new TelegramBot(token, options);

bot.on("message", ({ chat, from, text }) => {
  const userProfile = new UserProfile(`${from.first_name} ${from.last_name}`, from.id, undefined);
  const context = new TelegramProcessMessageContext("StandBot", new Message(text), userProfile, chat);

  StandBot
    .processMessage(context)
    .catch(context.handleError);
});

class TelegramProcessMessageContext extends ProcessMessageContext {
  private readonly chat: any;

  public constructor(botName: string, message: Message, userProfile: UserProfile, chat: any) {
    super(botName, message, userProfile);

    this.chat = chat;
  }

  public sendMessage = (message: string) => {
    bot.sendMessage(this.chat.id, message);
  }
}

if (env === "production" && process.env.START_TELEGRAM === "true") {
  // Start the bot 🚀
  publicUrl().then((url) => {
      console.log("Set telegram webhook to", url);
      bot.setWebHook(`${url}/bot${token}`);
    });
}
