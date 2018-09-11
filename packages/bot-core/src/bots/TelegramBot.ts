import { BaseBot } from "./BaseBot";
import TelegramBotApi, { ConstructorOptions } from 'node-telegram-bot-api'
import UserProfile from "../models/UserProfile";
import Message from "../models/Message";
import ActionExecutor from "../ActionExecutor";
import { ILogger } from "../models/ILogger";
import PublicUrl from "../services/PublicUrl";

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
    } as ConstructorOptions)
    this.subscribeListeners()
  }

  private subscribeListeners() {
    this.bot.on("message", ({ chat, from, text }) => {
      const userProfile = new UserProfile(`${from.first_name} ${from.last_name}`, from.id, undefined);

      this.executor.processMessage(this, userProfile, new Message(text))
        .catch(e => this.handleError(e, userProfile));
    });
  }

  public sendMessageToChat = (message: string, chatId: number) => {
    this.bot.sendMessage(chatId, message);
  }

  public listen = (createWebhook?: (url: string) => string) => {
    PublicUrl().then((url) => {
      const webhookUrl = createWebhook ? createWebhook(url) : url
      console.log("Set telegram webhook to", webhookUrl);

      this.bot.setWebHook(`${webhookUrl}/bot${this.token}`)
        .then(() => console.log(`Telegram bot has been started on port ${this.port}`))
        .catch((e: any) => console.log("Telegram bot triggered unhandled rejection", e));
    });
  }
}

export default TelegramBot
