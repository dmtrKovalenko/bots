import TelegramBotApi, { ConstructorOptions } from "node-telegram-bot-api";
import ActionExecutor from "../ActionExecutor";
import { ILogger } from "../models/ILogger";
import Message from "../models/Message";
import UserProfile from "../models/UserProfile";
import PublicUrl from "../services/PublicUrl";
import { BaseBot } from "./BaseBot";

class TelegramBot extends BaseBot {
  private bot: TelegramBotApi;

  public constructor(
    private token: string | undefined,
    botName: string,
    protected logger: ILogger,
    private executor: ActionExecutor,
    private polling: boolean,
    private webhook: boolean,
    private port: number = 8443,
  ) {
    super(botName, logger);

    if (!token) {
      throw new Error("Telegram bot token should be provided");
    }

    this.bot = new TelegramBotApi(token, {
      polling,
      webHook: webhook ? { port } : false,
    } as ConstructorOptions);
    this.subscribeListeners();
  }

  public sendMessageToChat = (message: string, chatId: number) => {
    this.bot.sendMessage(chatId, message);
  }

  public listen = (createWebhook?: (url: string) => string) => {
    PublicUrl().then((url) => {
      const webhookUrl = createWebhook ? createWebhook(url) : url;
      console.log("Set telegram webhook to", webhookUrl);

      this.bot.setWebHook(`${webhookUrl}/bot${this.token}`)
        .then(() => console.log(`Telegram bot has been started on port ${this.port}`))
        .catch((e: any) => console.log("Telegram bot triggered unhandled rejection", e));
    });
  }

  private subscribeListeners() {
    this.bot.on("message", ({ chat, from, text }) => {
      const userProfile = new UserProfile(`${from.first_name} ${from.last_name}`, from.id, undefined);

      this.executor.processMessage(this, userProfile, new Message(text))
        .catch((e) => this.handleError(e, userProfile));
    });
  }
}

export default TelegramBot;
